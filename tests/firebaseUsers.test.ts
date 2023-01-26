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

let testEnv: RulesTestEnvironment;
beforeAll(async () => {
  // Connection GRPC stream errorを出さないため
  // https://github.com/firebase/firebase-js-sdk/issues/5872
  setLogLevel('error');
  testEnv = await initializeTestEnvironment({
    projectId: 'test',
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

describe('/users/{userId}', () => {
  describe('create', () => {
    it('認証userはデータ追加可。', async () => {
      const context = testEnv.authenticatedContext('alice');
      const db = context.firestore();
      const usersRef = collection(db, 'users');
      await assertSucceeds(
        addDoc(usersRef, {
          name: 'hoge',
          iconUrl: 'image/icon',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      );
    });

    it('未認証userはデータ追加不可。', async () => {
      const context = testEnv.unauthenticatedContext();
      const db = context.firestore();
      const usersRef = collection(db, 'users');
      await assertFails(
        addDoc(usersRef, {
          name: 'hoge',
          iconUrl: 'image/icon',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      );
    });

    it('name21字は追加不可。', async () => {
      const context = testEnv.authenticatedContext('alice');
      const db = context.firestore();
      const usersRef = collection(db, 'users');
      await assertFails(
        addDoc(usersRef, {
          name: 'hogehogehogehogehogeh',
          iconUrl: 'image/icon',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      );
    });

    it('nameなしは追加不可。', async () => {
      const context = testEnv.authenticatedContext('alice');
      const db = context.firestore();
      const usersRef = collection(db, 'users');
      await assertFails(
        addDoc(usersRef, {
          name: '',
          iconUrl: 'image/icon',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      );
    });

    it('iconUrlなしは追加不可。', async () => {
      const context = testEnv.authenticatedContext('alice');
      const db = context.firestore();
      const usersRef = collection(db, 'users');
      await assertFails(
        addDoc(usersRef, {
          name: 'hoge',
          iconUrl: '',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      );
    });

    it('createdAtがサーバーの時刻じゃなかったら追加不可。', async () => {
      const date = new Date();
      const context = testEnv.authenticatedContext('alice');
      const db = context.firestore();
      const usersRef = collection(db, 'users');
      await assertFails(
        addDoc(usersRef, {
          name: 'hoge',
          iconUrl: 'image/icon',
          createdAt: date,
          updatedAt: date,
        })
      );
    });

    it('updatedAtがサーバーの時刻じゃなかったら追加不可。', async () => {
      const date = new Date();
      const context = testEnv.authenticatedContext('alice');
      const db = context.firestore();
      const usersRef = collection(db, 'users');
      await assertFails(
        addDoc(usersRef, {
          name: 'hoge',
          iconUrl: 'image/icon',
          createdAt: date,
          updatedAt: date,
        })
      );
    });
  });

  describe('read', () => {
    it('認証userはデータ読み込み可。', async () => {
      const context = testEnv.authenticatedContext('alice');
      const db = context.firestore();
      const usersRef = doc(db, 'users', 'alice');
      await assertSucceeds(getDoc(usersRef));
    });

    it('未認証userはデータ読み込み不可。', async () => {
      const context = testEnv.unauthenticatedContext();
      const db = context.firestore();
      const usersRef = doc(db, 'users', 'alice');
      await assertFails(getDoc(usersRef));
    });
  });

  describe('update', () => {
    beforeEach(async () => {
      const context = testEnv.authenticatedContext('alice');
      const db = context.firestore();
      const usersRef = doc(db, 'users', 'alice');
      await setDoc(usersRef, {
        name: 'hoge',
        iconUrl: 'image/icon',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      const anotherUsersRef = doc(db, 'users', 'bob');
      await setDoc(anotherUsersRef, {
        name: 'hoge',
        iconUrl: 'image/icon',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    });

    it('user本人はデータ更新可。', async () => {
      const context = testEnv.authenticatedContext('alice');
      const db = context.firestore();
      const usersRef = doc(db, 'users', 'alice');
      await assertSucceeds(
        updateDoc(usersRef, {
          name: 'hogehoge',
          iconUrl: 'image/icon',
          updatedAt: serverTimestamp(),
        })
      );
    });

    it('user本人以外はデータ更新不可。', async () => {
      const context = testEnv.authenticatedContext('alice');
      const db = context.firestore();
      const usersRef = doc(db, 'users', 'bob');
      await assertFails(
        updateDoc(usersRef, {
          name: 'hogehoge',
          iconUrl: 'image/icon',
          updatedAt: serverTimestamp(),
        })
      );
    });

    it('name21字はデータ更新不可。', async () => {
      const context = testEnv.authenticatedContext('alice');
      const db = context.firestore();
      const usersRef = doc(db, 'users', 'alice');
      await assertFails(
        updateDoc(usersRef, {
          name: 'hogehogehogehogehogeh',
          updatedAt: serverTimestamp(),
        })
      );
    });

    it('nameなしはデータ更新不可。', async () => {
      const context = testEnv.authenticatedContext('alice');
      const db = context.firestore();
      const usersRef = doc(db, 'users', 'alice');
      await assertFails(
        updateDoc(usersRef, {
          name: '',
          updatedAt: serverTimestamp(),
        })
      );
    });

    it('iconUrlなしはデータ更新不可。', async () => {
      const context = testEnv.authenticatedContext('alice');
      const db = context.firestore();
      const usersRef = doc(db, 'users', 'alice');
      await assertFails(
        updateDoc(usersRef, {
          iconUrl: '',
          updatedAt: serverTimestamp(),
        })
      );
    });

    it('未認証userはデータ更新不可。', async () => {
      const context = testEnv.unauthenticatedContext();
      const db = context.firestore();
      const usersRef = doc(db, 'users', 'bob');
      await assertFails(
        updateDoc(usersRef, {
          name: 'hogehoge',
          iconUrl: 'image/icon',
          updatedAt: serverTimestamp(),
        })
      );
    });

    it('未認証userはデータ更新不可。', async () => {
      const context = testEnv.unauthenticatedContext();
      const db = context.firestore();
      const usersRef = doc(db, 'users', 'alice');
      await assertFails(
        updateDoc(usersRef, {
          name: 'hoge',
          iconUrl: 'image/icon',
          updatedAt: serverTimestamp(),
        })
      );
    });

    it('createdAtはデータ更新不可。', async () => {
      const context = testEnv.authenticatedContext('alice');
      const db = context.firestore();
      const usersRef = doc(db, 'users', 'alice');
      await assertFails(
        updateDoc(usersRef, {
          createdAt: serverTimestamp(),
        })
      );
    });

    it('updatedAtがサーバーの時刻じゃなかったら更新不可。', async () => {
      const date = new Date();
      const context = testEnv.authenticatedContext('alice');
      const db = context.firestore();
      const usersRef = doc(db, 'users', 'alice');
      await assertFails(
        updateDoc(usersRef, {
          updatedAt: date,
        })
      );
    });
  });

  describe('delete', () => {
    beforeEach(async () => {
      await testEnv.withSecurityRulesDisabled(async (context) => {
        const db = context.firestore();
        const usersRef = doc(db, 'users', 'alice');
        setDoc(usersRef, {
          name: 'hoge',
          iconUrl: 'image/icon',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      });
    });

    it('user本人はデータ削除可。', async () => {
      const context = testEnv.authenticatedContext('alice');
      const db = context.firestore();
      const usersRef = doc(db, 'users', 'alice');
      await assertSucceeds(deleteDoc(usersRef));
    });

    it('user本人以外はデータ削除不可。', async () => {
      const context = testEnv.authenticatedContext('alice');
      const db = context.firestore();
      const usersRef = doc(db, 'users', 'bob');
      await assertFails(deleteDoc(usersRef));
    });

    it('未認証userはデータ削除不可。', async () => {
      const context = testEnv.unauthenticatedContext();
      const db = context.firestore();
      const usersRef = doc(db, 'users', 'bob');
      await assertFails(deleteDoc(usersRef));
    });
  });
});

describe('friends/{friendUserId}', () => {
  describe('read', () => {
    it('認証userはデータ読み込み可。', async () => {
      const context = testEnv.authenticatedContext('alice');
      const db = context.firestore();
      const usersRef = collection(db, 'users', 'alice', 'friends');
      await assertSucceeds(getDocs(usersRef));
    });

    it('未認証userはデータ読み込み不可。', async () => {
      const context = testEnv.unauthenticatedContext();
      const db = context.firestore();
      const usersRef = collection(db, 'users', 'alice', 'friends');
      await assertFails(getDocs(usersRef));
    });
  });

  describe('update', () => {
    it('user本人は友達追加可。', async () => {
      const context = testEnv.authenticatedContext('alice');
      const db = context.firestore();
      const usersRef = doc(db, 'users', 'alice', 'friends', 'bob');
      await assertSucceeds(
        setDoc(usersRef, {
          name: 'hoge',
          iconUrl: 'image/icon',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      );
    });

    it('user本人以外は友達追加不可。', async () => {
      const context = testEnv.authenticatedContext('alice');
      const db = context.firestore();
      const usersRef = doc(db, 'users', 'bob', 'friends', 'alice');
      await assertFails(
        setDoc(usersRef, {
          name: 'hoge',
          iconUrl: 'image/icon',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      );
    });
  });

  // describe('create', () => {
  //   it('user本人は友達追加可。', async () => {
  //     const context = testEnv.authenticatedContext('alice');
  //     const db = context.firestore();
  //     const usersRef = doc(db, 'users', 'alice', 'friends', 'bob');
  //     await assertSucceeds(
  //       setDoc(usersRef, {
  //         name: 'hoge',
  //         iconUrl: 'image/icon',
  //         createdAt: serverTimestamp(),
  //         updatedAt: serverTimestamp(),
  //       })
  //     );
  //   });

  //   it('user本人以外は友達追加不可。', async () => {
  //     const context = testEnv.authenticatedContext('alice');
  //     const db = context.firestore();
  //     const usersRef = doc(db, 'users', 'bob', 'friends', 'alice');
  //     await assertFails(
  //       setDoc(usersRef, {
  //         name: 'hoge',
  //         iconUrl: 'image/icon',
  //         createdAt: serverTimestamp(),
  //         updatedAt: serverTimestamp(),
  //       })
  //     );
  //   });
  // });
});
