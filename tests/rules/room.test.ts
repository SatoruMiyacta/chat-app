import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  RulesTestEnvironment,
} from '@firebase/rules-unit-testing';

import {
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  collection,
  addDoc,
  setLogLevel,
} from '@firebase/firestore';

import { readFileSync } from 'fs';
import { afterAll, afterEach, beforeAll, describe, it } from 'vitest';
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

const setDataInUsersJoinedRoomsCollection = async (
  userId: string,
  roomId: string
) => {
  await testEnv.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    const roomRef = doc(db, 'users', userId, 'joinedRooms', roomId);
    await setDoc(roomRef, {
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  });
};

const setDataInRoomsCollection = async (userId: string, roomId: string) => {
  await testEnv.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    const roomRef = doc(db, 'rooms', roomId);
    await setDoc(roomRef, {
      authorId: userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  });
};

const setDataInRoomsMessageCollection = async (
  userId: string,
  roomId: string,
  messageId: string
) => {
  await testEnv.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    const roomRef = doc(db, 'rooms', roomId, 'messages', messageId);
    await setDoc(roomRef, {
      message: 'こんにちは',
      postUserId: userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  });
};

describe('/users/{userId}/joinedRooms/{roomId}', () => {
  describe('read', async () => {
    it('自分は読み込み可。', async () => {
      const userId = uuidv4();
      const roomId = uuidv4();
      await setDataInUsersJoinedRoomsCollection(userId, roomId);

      const context = testEnv.authenticatedContext(userId);
      const db = context.firestore();
      const roomRef = doc(db, 'users', userId, 'joinedRooms', roomId);
      await assertSucceeds(getDoc(roomRef));
    });

    it('自分以外は読み込み不可。', async () => {
      const userId = uuidv4();
      const roomId = uuidv4();
      await setDataInUsersJoinedRoomsCollection(userId, roomId);

      const context = testEnv.authenticatedContext(uuidv4());
      const db = context.firestore();
      const roomRef = doc(db, 'users', userId, 'joinedRooms', roomId);
      await assertFails(getDoc(roomRef));
    });
  });

  describe('create', () => {
    it('認証ユーザーはルーム作成可。', async () => {
      const userId = uuidv4();

      const context = testEnv.authenticatedContext(userId);
      const db = context.firestore();
      const roomRef = doc(db, 'users', userId, 'joinedRooms', uuidv4());
      await assertSucceeds(
        setDoc(roomRef, {
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      );
    });

    it('認証ユーザー以外はルーム作成不可。', async () => {
      const userId = uuidv4();
      const roomId = uuidv4();

      const context = testEnv.unauthenticatedContext();
      const db = context.firestore();
      const roomRef = doc(db, 'users', userId, 'joinedRooms', roomId);
      await assertFails(
        setDoc(roomRef, {
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      );
    });
  });

  describe('delete', () => {
    it('本人は削除可。', async () => {
      const userId = uuidv4();
      const roomId = uuidv4();
      await setDataInUsersJoinedRoomsCollection(userId, roomId);

      const context = testEnv.authenticatedContext(userId);
      const db = context.firestore();
      const roomRef = doc(db, 'users', userId, 'joinedRooms', roomId);
      await assertSucceeds(deleteDoc(roomRef));
    });

    it('本人以外は削除不可。', async () => {
      const userId = uuidv4();
      const roomId = uuidv4();
      await setDataInUsersJoinedRoomsCollection(userId, roomId);

      const context = testEnv.authenticatedContext(uuidv4());
      const db = context.firestore();
      const roomRef = doc(db, 'users', userId, 'joinedRooms', roomId);
      await assertFails(deleteDoc(roomRef));
    });
  });
});

describe('/rooms/{roomId}', () => {
  describe('read', () => {
    it('認証済みuserかつ、自分が参加しているルームは読み込み可。', async () => {
      const userId = uuidv4();
      const roomId = uuidv4();
      await setDataInUsersJoinedRoomsCollection(userId, roomId);
      await setDataInRoomsCollection(userId, roomId);

      const context = testEnv.authenticatedContext(userId);
      const db = context.firestore();
      const roomRef = doc(db, 'rooms', roomId);
      await assertSucceeds(getDoc(roomRef));
    });

    it('未認証userかつ、自分が参加していないルームは読み込み不可。', async () => {
      const userId = uuidv4();
      const roomId = uuidv4();
      await setDataInUsersJoinedRoomsCollection(userId, roomId);
      await setDataInRoomsCollection(userId, roomId);

      const context = testEnv.unauthenticatedContext();
      const db = context.firestore();
      const roomRef = doc(db, 'rooms', roomId);
      await assertFails(getDoc(roomRef));
    });
  });

  describe('create', () => {
    it('認証済みユーザーは作成可。', async () => {
      const userId = uuidv4();
      const roomId = uuidv4();

      const context = testEnv.authenticatedContext(userId);
      const db = context.firestore();
      const roomRef = doc(db, 'rooms', roomId);
      await assertSucceeds(
        setDoc(roomRef, {
          authorId: userId,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      );
    });

    it('未認証ユーザーは作成不可。', async () => {
      const userId = uuidv4();
      const roomId = uuidv4();

      const context = testEnv.unauthenticatedContext();
      const db = context.firestore();
      const roomRef = doc(db, 'rooms', roomId);
      await assertFails(
        setDoc(roomRef, {
          authorId: userId,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      );
    });

    it('authorIdが空文字の場合は作成不可。', async () => {
      const userId = uuidv4();
      const roomId = uuidv4();

      const context = testEnv.authenticatedContext(userId);
      const db = context.firestore();
      const roomRef = doc(db, 'rooms', roomId);
      await assertFails(
        setDoc(roomRef, {
          authorId: '',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      );
    });

    it('authorIdが1文字の場合は作成可。', async () => {
      const userId = uuidv4();
      const roomId = uuidv4();

      const context = testEnv.authenticatedContext(userId);
      const db = context.firestore();
      const roomRef = doc(db, 'rooms', roomId);
      await assertSucceeds(
        setDoc(roomRef, {
          authorId: 't',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      );
    });

    it('authorIdが50文字の場合は作成可。', async () => {
      const userId = uuidv4();
      const roomId = uuidv4();

      const context = testEnv.authenticatedContext(userId);
      const db = context.firestore();
      const roomRef = doc(db, 'rooms', roomId);
      let str = '';
      for (let i = 0; i < 50; i++) {
        str = str + 't';
      }
      await assertSucceeds(
        setDoc(roomRef, {
          authorId: str,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      );
    });

    it('authorIdが51文字の場合は作成不可。', async () => {
      const userId = uuidv4();
      const roomId = uuidv4();

      const context = testEnv.authenticatedContext(userId);
      const db = context.firestore();
      const roomRef = doc(db, 'rooms', roomId);
      let str = '';
      for (let i = 0; i < 51; i++) {
        str = str + 't';
      }
      await assertFails(
        setDoc(roomRef, {
          authorId: str,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      );
    });
  });

  describe('delete', () => {
    it('作成したユーザーは削除可。', async () => {
      const userId = uuidv4();
      const roomId = uuidv4();
      await setDataInRoomsCollection(userId, roomId);

      const context = testEnv.authenticatedContext(userId);
      const db = context.firestore();
      const roomRef = doc(db, 'rooms', roomId);
      await assertSucceeds(deleteDoc(roomRef));
    });

    it('作成したユーザー以外は削除不可。', async () => {
      const userId = uuidv4();
      const roomId = uuidv4();
      await setDataInRoomsCollection(userId, roomId);

      const context = testEnv.authenticatedContext(uuidv4());
      const db = context.firestore();
      const roomRef = doc(db, 'rooms', roomId);
      await assertFails(deleteDoc(roomRef));
    });
  });
});

describe('/rooms/{roomId}/messages/{messageId}', () => {
  describe('read', async () => {
    it('認証ユーザーの場合、自分が参加しているルームのメッセージは読み込み可。', async () => {
      const userId = uuidv4();
      const roomId = uuidv4();
      const messageId = uuidv4();
      await setDataInUsersJoinedRoomsCollection(userId, roomId);
      await setDataInRoomsMessageCollection(userId, roomId, messageId);

      const context = testEnv.authenticatedContext(userId);
      const db = context.firestore();
      const roomRef = doc(db, 'rooms', roomId, 'messages', messageId);
      await assertSucceeds(getDoc(roomRef));
    });

    it('未認証ユーザーの場合、自分が参加していないルームのメッセージは読み込み不可。', async () => {
      const userId = uuidv4();
      const roomId = uuidv4();
      const messageId = uuidv4();
      await setDataInUsersJoinedRoomsCollection(userId, roomId);
      await setDataInRoomsMessageCollection(userId, roomId, messageId);

      const context = testEnv.unauthenticatedContext();
      const db = context.firestore();
      const roomRef = doc(db, 'rooms', roomId, 'messages', messageId);
      await assertFails(getDoc(roomRef));
    });
  });

  describe('create', () => {
    it('認証ユーザーの場合、自分が参加しているルームでメッセージは作成可。', async () => {
      const userId = uuidv4();
      const roomId = uuidv4();
      const messageId = uuidv4();
      await setDataInUsersJoinedRoomsCollection(userId, roomId);
      await setDataInRoomsMessageCollection(userId, roomId, messageId);

      const context = testEnv.authenticatedContext(userId);
      const db = context.firestore();
      const roomRef = collection(db, 'rooms', roomId, 'messages');
      await assertSucceeds(
        addDoc(roomRef, {
          message: 'こんにちは',
          postUserId: userId,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      );
    });

    it('認証ユーザーの場合、自分が参加していないルームのメッセージは作成不可。', async () => {
      const userId = uuidv4();
      const roomId = uuidv4();
      const messageId = uuidv4();
      await setDataInUsersJoinedRoomsCollection(userId, roomId);
      await setDataInRoomsMessageCollection(userId, roomId, messageId);

      const context = testEnv.authenticatedContext(userId);
      const db = context.firestore();
      const roomRef = collection(db, 'rooms', uuidv4(), 'messages');
      await assertFails(
        addDoc(roomRef, {
          message: 'こんにちは',
          postUserId: userId,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      );
    });

    it('未認証ユーザーの場合、自分が参加していないルームでメッセージは作成不可。', async () => {
      const userId = uuidv4();
      const roomId = uuidv4();
      const messageId = uuidv4();
      await setDataInUsersJoinedRoomsCollection(userId, roomId);
      await setDataInRoomsMessageCollection(userId, roomId, messageId);

      const context = testEnv.unauthenticatedContext();
      const db = context.firestore();
      const roomRef = collection(db, 'rooms', roomId, 'messages');
      await assertFails(
        addDoc(roomRef, {
          message: 'こんにちは',
          postUserId: userId,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      );
    });
  });

  describe('delete', async () => {
    it('作成者は削除可。', async () => {
      const userId = uuidv4();
      const roomId = uuidv4();
      const messageId = uuidv4();
      await setDataInRoomsMessageCollection(userId, roomId, messageId);
      await setDataInUsersJoinedRoomsCollection(userId, roomId);
      await setDataInRoomsCollection(userId, roomId);

      const context = testEnv.authenticatedContext(userId);
      const db = context.firestore();
      const roomRef = doc(db, 'rooms', roomId, 'messages', messageId);
      await assertSucceeds(deleteDoc(roomRef));
    });

    it('作成者以外は削除不可。', async () => {
      const userId = uuidv4();
      const roomId = uuidv4();
      const messageId = uuidv4();
      await setDataInRoomsMessageCollection(userId, roomId, messageId);
      await setDataInUsersJoinedRoomsCollection(userId, roomId);
      await setDataInRoomsCollection(userId, roomId);

      const context = testEnv.authenticatedContext(uuidv4());
      const db = context.firestore();
      const roomRef = doc(db, 'rooms', roomId, 'messages', messageId);
      await assertFails(deleteDoc(roomRef));
    });

    it('未認証ユーザーは削除不可。', async () => {
      const userId = uuidv4();
      const roomId = uuidv4();
      const messageId = uuidv4();
      await setDataInRoomsMessageCollection(userId, roomId, messageId);
      await setDataInUsersJoinedRoomsCollection(userId, roomId);
      await setDataInRoomsCollection(userId, roomId);

      const context = testEnv.unauthenticatedContext();
      const db = context.firestore();
      const roomRef = doc(db, 'rooms', roomId, 'messages', messageId);
      await assertFails(deleteDoc(roomRef));
    });
  });

  describe('update', async () => {
    it('作成者は更新可。', async () => {
      const userId = uuidv4();
      const roomId = uuidv4();
      const messageId = uuidv4();
      await setDataInUsersJoinedRoomsCollection(userId, roomId);
      await setDataInRoomsMessageCollection(userId, roomId, messageId);
      await setDataInRoomsCollection(userId, roomId);

      const context = testEnv.authenticatedContext(userId);
      const db = context.firestore();
      const roomRef = doc(db, 'rooms', roomId, 'messages', messageId);
      await assertSucceeds(
        updateDoc(roomRef, {
          message: 'こんばんは',
          updatedAt: serverTimestamp(),
        })
      );
    });

    it('作成者以外は更新不可。', async () => {
      const userId = uuidv4();
      const roomId = uuidv4();
      const messageId = uuidv4();
      await setDataInUsersJoinedRoomsCollection(userId, roomId);
      await setDataInRoomsMessageCollection(userId, roomId, messageId);
      await setDataInRoomsCollection(userId, roomId);

      const context = testEnv.authenticatedContext(uuidv4());
      const db = context.firestore();
      const roomRef = doc(db, 'rooms', roomId, 'messages', messageId);
      await assertFails(
        updateDoc(roomRef, {
          message: 'こんばんは',
          updatedAt: serverTimestamp(),
        })
      );
    });

    it('updatedAtなしは更新不可。', async () => {
      const userId = uuidv4();
      const roomId = uuidv4();
      const messageId = uuidv4();
      await setDataInUsersJoinedRoomsCollection(userId, roomId);
      await setDataInRoomsMessageCollection(userId, roomId, messageId);
      await setDataInRoomsCollection(userId, roomId);

      const context = testEnv.authenticatedContext(userId);
      const db = context.firestore();
      const roomRef = doc(db, 'rooms', roomId, 'messages', messageId);
      await assertFails(
        updateDoc(roomRef, {
          message: 'こんばんは',
        })
      );
    });

    it('messageが空文字の場合は更新不可。', async () => {
      const userId = uuidv4();
      const roomId = uuidv4();
      const messageId = uuidv4();
      await setDataInUsersJoinedRoomsCollection(userId, roomId);
      await setDataInRoomsMessageCollection(userId, roomId, messageId);
      await setDataInRoomsCollection(userId, roomId);

      const context = testEnv.authenticatedContext(userId);
      const db = context.firestore();
      const roomRef = doc(db, 'rooms', roomId, 'messages', messageId);
      await assertFails(
        updateDoc(roomRef, {
          message: '',
          updatedAt: serverTimestamp(),
        })
      );
    });

    it('messageが1文字の場合は更新可。', async () => {
      const userId = uuidv4();
      const roomId = uuidv4();
      const messageId = uuidv4();
      await setDataInUsersJoinedRoomsCollection(userId, roomId);
      await setDataInRoomsMessageCollection(userId, roomId, messageId);
      await setDataInRoomsCollection(userId, roomId);

      const context = testEnv.authenticatedContext(userId);
      const db = context.firestore();
      const roomRef = doc(db, 'rooms', roomId, 'messages', messageId);
      await assertSucceeds(
        updateDoc(roomRef, {
          message: 'こ',
          updatedAt: serverTimestamp(),
        })
      );
    });

    it('messageが10000文字の場合は更新可。', async () => {
      const userId = uuidv4();
      const roomId = uuidv4();
      const messageId = uuidv4();
      await setDataInUsersJoinedRoomsCollection(userId, roomId);
      await setDataInRoomsMessageCollection(userId, roomId, messageId);
      await setDataInRoomsCollection(userId, roomId);

      const context = testEnv.authenticatedContext(userId);
      const db = context.firestore();
      const roomRef = doc(db, 'rooms', roomId, 'messages', messageId);
      let str = '';
      for (let i = 0; i < 10000; i++) {
        str = str + 'こ';
      }

      await assertSucceeds(
        updateDoc(roomRef, {
          message: str,
          updatedAt: serverTimestamp(),
        })
      );
    });

    it('messageが10001文字の場合は更新不可。', async () => {
      const userId = uuidv4();
      const roomId = uuidv4();
      const messageId = uuidv4();
      await setDataInUsersJoinedRoomsCollection(userId, roomId);
      await setDataInRoomsMessageCollection(userId, roomId, messageId);
      await setDataInRoomsCollection(userId, roomId);

      const context = testEnv.authenticatedContext(userId);
      const db = context.firestore();
      const roomRef = doc(db, 'rooms', roomId, 'messages', messageId);
      let str = '';
      for (let i = 0; i < 10001; i++) {
        str = str + 'こ';
      }

      await assertFails(
        updateDoc(roomRef, {
          message: str,
          updatedAt: serverTimestamp(),
        })
      );
    });
  });
});
