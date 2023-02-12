import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  RulesTestEnvironment,
} from '@firebase/rules-unit-testing';

import {
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  collection,
  addDoc,
  setLogLevel,
} from '@firebase/firestore';

import { readFileSync } from 'fs';
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  it,
} from 'vitest';

import { v4 as uuidv4 } from 'uuid';
let testEnv: RulesTestEnvironment;
beforeAll(async () => {
  // Connection GRPC stream errorを出さないため
  // https://github.com/firebase/firebase-js-sdk/issues/5872
  setLogLevel('error');
  testEnv = await initializeTestEnvironment({
    projectId: uuidv4(),
    firestore: {
      rules: readFileSync('firestore.rules', 'utf8'),
    },
  });
});

afterAll(() => {
  testEnv.cleanup();
});

afterEach(() => {
  testEnv.clearFirestore();
});

const setDataInUsersJoinedGroupsCollection = async (
  userId: string,
  groupId: string
) => {
  await testEnv.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    const groupsRef = doc(db, 'users', userId, 'joinedGroups', groupId);
    await setDoc(groupsRef, {
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  });
};

const setDataInGroupsCollection = async (userId: string, groupId: string) => {
  await testEnv.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    const groupsRef = doc(db, 'groups', groupId);
    await setDoc(groupsRef, {
      authorId: userId,
      name: 'testGroup',
      iconUrl: '/public/images/user-solid.svg',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  });
};

const setDataInGroupsMemberCollection = async (
  userId: string,
  groupId: string
) => {
  await testEnv.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    const groupsRef = doc(db, 'groups', groupId, 'members', userId);
    await setDoc(groupsRef, {
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  });
};

describe('/users/{userId}/joinedGroups/{groupId}', () => {
  describe('read', async () => {
    it('自分は読み込み可。', async () => {
      const userId = uuidv4();
      const groupId = uuidv4();
      await setDataInUsersJoinedGroupsCollection(userId, groupId);

      const context = testEnv.authenticatedContext(userId);
      const db = context.firestore();
      const groupsRef = doc(db, 'users', userId, 'joinedGroups', groupId);
      await assertSucceeds(getDoc(groupsRef));
    });

    it('自分以外は読み込み不可。', async () => {
      const userId = uuidv4();
      const groupId = uuidv4();
      await setDataInUsersJoinedGroupsCollection(userId, groupId);

      const context = testEnv.authenticatedContext(uuidv4());
      const db = context.firestore();
      const groupsRef = doc(db, 'users', userId, 'joinedGroups', groupId);
      await assertFails(getDoc(groupsRef));
    });
  });

  describe('create', () => {
    it('自分はグループ作成可。', async () => {
      const userId = uuidv4();
      const context = testEnv.authenticatedContext(userId);
      const db = context.firestore();
      const groupsRef = doc(db, 'users', userId, 'joinedGroups', uuidv4());
      await assertSucceeds(
        setDoc(groupsRef, {
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      );
    });

    it('自分以外はグループ作成不可。', async () => {
      const userId = uuidv4();
      const context = testEnv.authenticatedContext(userId);
      const db = context.firestore();
      const groupsRef = doc(db, 'users', uuidv4(), 'joinedGroups', uuidv4());
      await assertFails(
        setDoc(groupsRef, {
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      );
    });
  });

  describe('delete', () => {
    it('自分は削除可。', async () => {
      const userId = uuidv4();
      const groupId = uuidv4();
      await setDataInUsersJoinedGroupsCollection(userId, groupId);

      const context = testEnv.authenticatedContext(userId);
      const db = context.firestore();
      const groupsRef = doc(db, 'users', userId, 'joinedGroups', groupId);
      await assertSucceeds(deleteDoc(groupsRef));
    });

    it('自分以外は削除不可。', async () => {
      const userId = uuidv4();
      const groupId = uuidv4();
      await setDataInUsersJoinedGroupsCollection(userId, groupId);

      const context = testEnv.authenticatedContext(uuidv4());
      const db = context.firestore();
      const groupsRef = doc(db, 'users', userId, 'joinedGroups', groupId);
      await assertFails(deleteDoc(groupsRef));
    });
  });
});

describe('groups/{groupId}', () => {
  describe('read', () => {
    it('認証済みuserかつ、自分が参加しているグループの場合は読み込み可。', async () => {
      const userId = uuidv4();
      const groupId = uuidv4();
      await setDataInUsersJoinedGroupsCollection(userId, groupId);
      await setDataInGroupsCollection(userId, groupId);

      const context = testEnv.authenticatedContext(userId);
      const db = context.firestore();
      const groupsRef = doc(db, 'groups', groupId);
      await assertSucceeds(getDoc(groupsRef));
    });

    it('未認証userかつ、自分が参加していないグループは読み込み不可。', async () => {
      const userId = uuidv4();
      const groupId = uuidv4();
      await setDataInUsersJoinedGroupsCollection(userId, groupId);
      await setDataInGroupsCollection(userId, groupId);

      const context = testEnv.unauthenticatedContext();
      const db = context.firestore();
      const groupsRef = doc(db, 'groups', groupId);
      await assertFails(getDoc(groupsRef));
    });
  });

  describe('create', () => {
    it('認証済みuserは作成可。', async () => {
      const userId = uuidv4();

      const context = testEnv.authenticatedContext(userId);
      const db = context.firestore();
      const groupsRef = collection(db, 'groups');
      await assertSucceeds(
        addDoc(groupsRef, {
          authorId: userId,
          name: 'testGroup',
          iconUrl: '/public/images/user-solid.svg',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      );
    });

    it('未認証userは作成不可。', async () => {
      const userId = uuidv4();

      const context = testEnv.unauthenticatedContext();
      const db = context.firestore();
      const groupsRef = collection(db, 'groups');
      await assertFails(
        addDoc(groupsRef, {
          authorId: userId,
          name: 'testGroup',
          iconUrl: '/public/images/user-solid.svg',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      );
    });
  });

  describe('delete', () => {
    it('グループ作成者は削除可。', async () => {
      const userId = uuidv4();
      const groupId = uuidv4();
      await setDataInGroupsCollection(userId, groupId);
      await setDataInUsersJoinedGroupsCollection(userId, groupId);

      const context = testEnv.authenticatedContext(userId);
      const db = context.firestore();
      const groupsRef = doc(db, 'groups', groupId);
      await assertSucceeds(deleteDoc(groupsRef));
    });

    it('グループ作成者以外は削除不可。', async () => {
      const userId = uuidv4();
      const groupId = uuidv4();
      await setDataInGroupsCollection(userId, groupId);
      await setDataInUsersJoinedGroupsCollection(userId, groupId);

      const context = testEnv.authenticatedContext(uuidv4());
      const db = context.firestore();
      const groupsRef = doc(db, 'groups', groupId);
      await assertFails(deleteDoc(groupsRef));
    });
  });
});

describe('/groups/{groupId}/members/{memberId}', () => {
  describe('read', () => {
    it('認証ユーザーかつ、自分が参加しているグループの場合は読み取り可', async () => {
      const userId = uuidv4();
      const groupId = uuidv4();
      await setDataInUsersJoinedGroupsCollection(userId, groupId);
      await setDataInGroupsMemberCollection(userId, groupId);

      // memberIdにuserIdが存在していれば良いため、認証されていればOK
      const context = testEnv.authenticatedContext(userId);
      const db = context.firestore();
      const groupsRef = doc(db, 'groups', groupId, 'members', uuidv4());
      await assertSucceeds(getDoc(groupsRef));
    });

    it('未認証ユーザーかつ、自分が参加していないグループの場合は読み取り不可', async () => {
      const userId = uuidv4();
      const groupId = uuidv4();
      await setDataInUsersJoinedGroupsCollection(userId, groupId);
      await setDataInGroupsMemberCollection(userId, groupId);

      const context = testEnv.unauthenticatedContext();
      const db = context.firestore();
      const groupsRef = doc(db, 'groups', groupId, 'members', userId);
      await assertFails(getDoc(groupsRef));
    });

    it('認証ユーザーかつ、自分が参加しているグループの場合はメンバー一覧の読み取り可', async () => {
      const userId = uuidv4();
      const groupId = uuidv4();
      await setDataInUsersJoinedGroupsCollection(userId, groupId);
      await setDataInGroupsMemberCollection(userId, groupId);

      const context = testEnv.authenticatedContext(userId);
      const db = context.firestore();
      const groupsRef = collection(db, 'groups', groupId, 'members');
      await assertSucceeds(getDocs(groupsRef));
    });

    it('認証ユーザーかつ、自分が参加していないグループの場合はメンバー一覧の読み取り不可', async () => {
      const userId = uuidv4();
      const groupId = uuidv4();
      await setDataInUsersJoinedGroupsCollection(userId, groupId);
      await setDataInGroupsMemberCollection(userId, groupId);

      const context = testEnv.authenticatedContext(uuidv4());
      const db = context.firestore();
      const groupsRef = collection(db, 'groups', groupId, 'members');
      await assertFails(getDocs(groupsRef));
    });
  });

  describe('create', () => {
    it('認証済みユーザーは作成可', async () => {
      const userId = uuidv4();
      const groupId = uuidv4();

      const context = testEnv.authenticatedContext(uuidv4());
      const db = context.firestore();
      const groupsRef = doc(db, 'groups', groupId, 'members', userId);
      await assertSucceeds(
        setDoc(groupsRef, {
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      );
    });

    it('未認証ユーザーは作成不可', async () => {
      const userId = uuidv4();
      const groupId = uuidv4();

      const context = testEnv.unauthenticatedContext();
      const db = context.firestore();
      const groupsRef = doc(db, 'groups', groupId, 'members', userId);
      await assertFails(
        setDoc(groupsRef, {
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      );
    });
  });

  describe('delete', () => {
    it('自分は削除可', async () => {
      const userId = uuidv4();
      const groupId = uuidv4();
      await setDataInGroupsMemberCollection(userId, groupId);

      const context = testEnv.authenticatedContext(userId);
      const db = context.firestore();
      const groupsRef = doc(db, 'groups', groupId, 'members', userId);
      await assertSucceeds(deleteDoc(groupsRef));
    });

    it('自分以外は削除不可', async () => {
      const userId = uuidv4();
      const groupId = uuidv4();
      await setDataInGroupsMemberCollection(userId, groupId);

      const context = testEnv.authenticatedContext(uuidv4());
      const db = context.firestore();
      const groupsRef = doc(db, 'groups', groupId, 'members', userId);
      await assertFails(deleteDoc(groupsRef));
    });
  });
});

// 'groups' = {
//     12345667:{
//         'members':{
//             9876543
//         }
//     }
// }
// 'groups'/12345667/'members'/9876543
