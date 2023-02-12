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
  test,
  expect,
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

const setUser = async (userId: string) => {
  await testEnv.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    const usersRef = doc(db, 'users', userId);
    await setDoc(usersRef, {
      name: 'nameTest',
      iconUrl: '/public/images/user-solid.svg',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  });
};

describe('/users/{userId}', () => {
  describe('create', () => {
    it('自分のデータは作成可。', async () => {
      const userId = uuidv4();
      const context = testEnv.authenticatedContext(userId);
      const db = context.firestore();
      const usersRef = doc(db, 'users', userId);
      await assertSucceeds(
        setDoc(usersRef, {
          name: 'test',
          iconUrl: '/public/images/user-solid.svg',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      );
    });

    it('他人のデータは作成不可。', async () => {
      const userId = uuidv4();
      const context = testEnv.authenticatedContext(userId);
      const db = context.firestore();
      const usersRef = doc(db, 'users', uuidv4());
      await assertFails(
        setDoc(usersRef, {
          name: 'test',
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
      const usersRef = doc(db, 'users', userId);
      await assertFails(
        setDoc(usersRef, {
          name: 'test',
          iconUrl: '/public/images/user-solid.svg',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      );
    });

    it('createdAtの時刻がサーバーにリクエストされた時刻と一致していなかったら作成不可。', async () => {
      const userId = uuidv4();
      const date = new Date(2023, 1, 6);

      const context = testEnv.authenticatedContext(userId);
      const db = context.firestore();
      const usersRef = doc(db, 'users', userId);
      await assertFails(
        setDoc(usersRef, {
          name: 'test',
          iconUrl: '/public/images/user-solid.svg',
          createdAt: date,
          updatedAt: serverTimestamp(),
        })
      );
    });

    it('updatedAtの時刻がサーバーにリクエストされた時刻と一致していなかったら作成不可。', async () => {
      const userId = uuidv4();
      const date = new Date(2023, 1, 6);

      const context = testEnv.authenticatedContext(userId);
      const db = context.firestore();
      const usersRef = doc(db, 'users', userId);
      await assertFails(
        setDoc(usersRef, {
          name: 'test',
          iconUrl: '/public/images/user-solid.svg',
          createdAt: serverTimestamp(),
          updatedAt: date,
        })
      );
    });

    it('nameの文字数が1字の場合は作成可。', async () => {
      const userId = uuidv4();
      const context = testEnv.authenticatedContext(userId);
      const db = context.firestore();
      const usersRef = doc(db, 'users', userId);
      await assertSucceeds(
        setDoc(usersRef, {
          name: 't',
          iconUrl: '/public/images/user-solid.svg',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      );
    });

    it('nameの文字数が20字の場合は作成可。', async () => {
      const userId = uuidv4();
      const context = testEnv.authenticatedContext(userId);
      const db = context.firestore();
      const usersRef = doc(db, 'users', userId);

      let str = '';
      for (let i = 0; i < 20; i++) {
        str = str + 't';
      }

      await assertSucceeds(
        setDoc(usersRef, {
          name: str,
          iconUrl: '/public/images/user-solid.svg',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      );
    });

    it('nameの文字数が21字の場合は作成不可。', async () => {
      const userId = uuidv4();
      const context = testEnv.authenticatedContext(userId);
      const db = context.firestore();
      const usersRef = doc(db, 'users', userId);

      let str = '';
      for (let i = 0; i < 21; i++) {
        str = str + 't';
      }

      await assertFails(
        setDoc(usersRef, {
          name: str,
          iconUrl: '/public/images/user-solid.svg',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      );
    });

    it.each`
      name
      ${''}
      ${null}
    `('nameが(%s)の場合は作成不可', async (name) => {
      const userId = uuidv4();
      const context = testEnv.authenticatedContext(userId);
      const db = context.firestore();
      const usersRef = doc(db, 'users', userId);
      await assertFails(
        setDoc(usersRef, {
          name: name,
          iconUrl: '/public/images/user-solid.svg',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      );
    });

    it('iconUrlが10文字の場合は作成可。', async () => {
      const userId = uuidv4();
      const context = testEnv.authenticatedContext(userId);
      const db = context.firestore();
      const usersRef = doc(db, 'users', userId);
      let str = '';
      for (let i = 0; i < 10; i++) {
        str = str + 't';
      }

      await assertSucceeds(
        setDoc(usersRef, {
          name: 'test',
          iconUrl: str,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      );
    });

    it('iconUrlが10000文字の場合は作成可。', async () => {
      const userId = uuidv4();
      const context = testEnv.authenticatedContext(userId);
      const db = context.firestore();
      const usersRef = doc(db, 'users', userId);

      let str = '';
      for (let i = 0; i < 10000; i++) {
        str = str + 't';
      }

      await assertSucceeds(
        setDoc(usersRef, {
          name: 'test',
          iconUrl: str,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      );
    });

    it('iconUrlが10001文字の場合は作成不可。', async () => {
      const userId = uuidv4();
      const context = testEnv.authenticatedContext(userId);
      const db = context.firestore();
      const usersRef = doc(db, 'users', userId);

      let str = '';
      for (let i = 0; i < 10001; i++) {
        str = str + 't';
      }

      await assertFails(
        setDoc(usersRef, {
          name: 'test',
          iconUrl: str,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      );
    });

    it.each`
      name
      ${''}
      ${null}
    `('iconUrlが(%s)の場合は作成不可', async (iconUrl) => {
      const userId = uuidv4();
      const context = testEnv.authenticatedContext(userId);
      const db = context.firestore();
      const usersRef = doc(db, 'users', userId);
      await assertFails(
        setDoc(usersRef, {
          name: 'test',
          iconUrl: iconUrl,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      );
    });

    it.each([
      {
        iconUrl: '/public/images/user-solid.svg',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      {
        name: 'test',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      {
        name: 'test',
        iconUrl: '/public/images/user-solid.svg',
        updatedAt: serverTimestamp(),
      },
      {
        name: 'test',
        iconUrl: '/public/images/user-solid.svg',
        createdAt: serverTimestamp(),
      },
    ])('プロパティが１つでもない場合は作成不可。', async (objectData) => {
      const userId = uuidv4();
      const context = testEnv.authenticatedContext(userId);
      const db = context.firestore();
      const usersRef = doc(db, 'users', userId);
      await assertFails(
        setDoc(usersRef, {
          objectData,
        })
      );
    });
  });

  describe('read', () => {
    it('認証userはデータ読み込み可。', async () => {
      const userId = uuidv4();
      await setUser(userId);

      const context = testEnv.authenticatedContext(userId);
      const db = context.firestore();
      const usersRef = doc(db, 'users', userId);
      await assertSucceeds(getDoc(usersRef));
    });

    it('未認証userはデータ読み込み不可。', async () => {
      const userId = uuidv4();
      await setUser(userId);

      const context = testEnv.unauthenticatedContext();
      const db = context.firestore();
      const usersRef = doc(db, 'users', userId);
      await assertFails(getDoc(usersRef));
    });
  });

  describe('update', () => {
    it('自分のデータは更新可。', async () => {
      const userId = uuidv4();
      await setUser(userId);

      const context = testEnv.authenticatedContext(userId);
      const db = context.firestore();
      const usersRef = doc(db, 'users', userId);
      await assertSucceeds(
        updateDoc(usersRef, {
          name: 'test',
          iconUrl: '/public/images/user-solid.svg',
          updatedAt: serverTimestamp(),
        })
      );
    });

    it('他人のデータは更新不可。', async () => {
      const userId = uuidv4();
      await setUser(userId);

      const context = testEnv.authenticatedContext(userId);
      const db = context.firestore();
      const usersRef = doc(db, 'users', uuidv4());
      await assertFails(
        updateDoc(usersRef, {
          name: 'test',
          iconUrl: '/public/images/user-solid.svg',
          updatedAt: serverTimestamp(),
        })
      );
    });

    it('未認証userは更新不可。', async () => {
      const userId = uuidv4();
      const context = testEnv.unauthenticatedContext();
      const db = context.firestore();
      const usersRef = doc(db, 'users', userId);
      await assertFails(
        updateDoc(usersRef, {
          name: 'test',
          iconUrl: '/public/images/user-solid.svg',
          updatedAt: serverTimestamp(),
        })
      );
    });

    it('自分自身でもcreatedAtは更新不可。', async () => {
      const userId = uuidv4();
      const context = testEnv.authenticatedContext(userId);
      const db = context.firestore();
      const usersRef = doc(db, 'users', userId);
      await assertFails(
        updateDoc(usersRef, {
          name: 'test',
          iconUrl: '/public/images/user-solid.svg',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      );
    });

    it('updatedAtの時刻がサーバーにリクエストされた時刻と一致していなかったら更新不可。', async () => {
      const userId = uuidv4();
      const date = new Date(2023, 1, 6);
      const context = testEnv.authenticatedContext(userId);
      const db = context.firestore();
      const usersRef = doc(db, 'users', userId);
      await assertFails(
        updateDoc(usersRef, {
          name: 'test',
          iconUrl: '/public/images/user-solid.svg',
          updatedAt: date,
        })
      );
    });

    it('nameの文字数が1字の場合は更新可。', async () => {
      const userId = uuidv4();
      await setUser(userId);

      const context = testEnv.authenticatedContext(userId);
      const db = context.firestore();
      const usersRef = doc(db, 'users', userId);
      await assertSucceeds(
        updateDoc(usersRef, {
          name: 't',
          iconUrl: '/public/images/user-solid.svg',
          updatedAt: serverTimestamp(),
        })
      );
    });

    it('nameの文字数が20字の場合は更新可。', async () => {
      const userId = uuidv4();
      await setUser(userId);

      const context = testEnv.authenticatedContext(userId);
      const db = context.firestore();
      const usersRef = doc(db, 'users', userId);

      let str = '';
      for (let i = 0; i < 20; i++) {
        str = str + 't';
      }

      await assertSucceeds(
        updateDoc(usersRef, {
          name: str,
          iconUrl: '/public/images/user-solid.svg',
          updatedAt: serverTimestamp(),
        })
      );
    });

    it('nameの文字数が21字の場合は更新不可。', async () => {
      const userId = uuidv4();
      await setUser(userId);

      const context = testEnv.authenticatedContext(userId);
      const db = context.firestore();
      const usersRef = doc(db, 'users', userId);
      let str = '';
      for (let i = 0; i < 21; i++) {
        str = str + 't';
      }
      await assertFails(
        updateDoc(usersRef, {
          name: str,
          iconUrl: '/public/images/user-solid.svg',
          updatedAt: serverTimestamp(),
        })
      );
    });

    it.each`
      name
      ${''}
      ${null}
    `('nameが(%s)の場合は更新不可', async ({ name }) => {
      const userId = uuidv4();
      await setUser(userId);

      const context = testEnv.authenticatedContext(userId);
      const db = context.firestore();
      const usersRef = doc(db, 'users', userId);
      await assertFails(
        updateDoc(usersRef, {
          name: name,
          iconUrl: '/public/images/user-solid.svg',
          updatedAt: serverTimestamp(),
        })
      );
    });

    it('iconUrlが10文字の場合は更新可。', async () => {
      const userId = uuidv4();
      await setUser(userId);

      const context = testEnv.authenticatedContext(userId);
      const db = context.firestore();
      const usersRef = doc(db, 'users', userId);
      let str = '';
      for (let i = 0; i < 10; i++) {
        str = str + 't';
      }
      await assertSucceeds(
        updateDoc(usersRef, {
          name: 'test',
          iconUrl: str,
          updatedAt: serverTimestamp(),
        })
      );
    });

    it('iconUrlが10000文字の場合は更新可。', async () => {
      const userId = uuidv4();
      await setUser(userId);

      const context = testEnv.authenticatedContext(userId);
      const db = context.firestore();
      const usersRef = doc(db, 'users', userId);
      let str = '';
      for (let i = 0; i < 10000; i++) {
        str = str + 't';
      }
      await assertSucceeds(
        updateDoc(usersRef, {
          name: 'test',
          iconUrl: str,
          updatedAt: serverTimestamp(),
        })
      );
    });

    it('iconUrlが10001文字の場合は更新不可。', async () => {
      const userId = uuidv4();
      await setUser(userId);

      const context = testEnv.authenticatedContext(userId);
      const db = context.firestore();
      const usersRef = doc(db, 'users', userId);
      let str = '';
      for (let i = 0; i < 10001; i++) {
        str = str + 't';
      }
      await assertFails(
        updateDoc(usersRef, {
          name: 'test',
          iconUrl: str,
          updatedAt: serverTimestamp(),
        })
      );
    });

    it.each`
      name
      ${''}
      ${null}
    `('iconUrlが(%s)の場合は更新不可', async (iconUrl) => {
      const userId = uuidv4();
      await setUser(userId);

      const context = testEnv.authenticatedContext(userId);
      const db = context.firestore();
      const usersRef = doc(db, 'users', userId);
      await assertFails(
        updateDoc(usersRef, {
          name: 'test',
          iconUrl: iconUrl,
          updatedAt: serverTimestamp(),
        })
      );
    });

    it('updatedAtなしは更新不可。', async () => {
      const userId = uuidv4();
      await setUser(userId);

      const context = testEnv.authenticatedContext(userId);
      const db = context.firestore();
      const usersRef = doc(db, 'users', userId);
      await assertFails(
        updateDoc(usersRef, {
          name: 'test',
        })
      );
    });

    it('nameだけの場合でも更新可。', async () => {
      const userId = uuidv4();
      await setUser(userId);

      const context = testEnv.authenticatedContext(userId);
      const db = context.firestore();
      const usersRef = doc(db, 'users', userId);
      await assertSucceeds(
        updateDoc(usersRef, {
          name: 'test',
          updatedAt: serverTimestamp(),
        })
      );
    });

    it('iconUrlだけの場合でも更新可。', async () => {
      const userId = uuidv4();
      await setUser(userId);

      const context = testEnv.authenticatedContext(userId);
      const db = context.firestore();
      const usersRef = doc(db, 'users', userId);
      await assertSucceeds(
        updateDoc(usersRef, {
          iconUrl: '/public/images/user-solid.svg',
          updatedAt: serverTimestamp(),
        })
      );
    });
  });

  describe('delete', () => {
    it('自分のデータは削除可。', async () => {
      const userId = uuidv4();
      await setUser(userId);

      const context = testEnv.authenticatedContext(userId);
      const db = context.firestore();
      const usersRef = doc(db, 'users', userId);
      await assertSucceeds(deleteDoc(usersRef));
    });

    it('自分以外のデータは削除不可。', async () => {
      const userId = uuidv4();
      await setUser(userId);

      const context = testEnv.authenticatedContext(userId);
      const db = context.firestore();
      const usersRef = doc(db, 'users', uuidv4());
      await assertFails(deleteDoc(usersRef));
    });

    it('未認証userはデータ削除不可。', async () => {
      const userId = uuidv4();
      await setUser(userId);

      const context = testEnv.unauthenticatedContext();
      const db = context.firestore();
      const usersRef = doc(db, 'users', uuidv4());
      await assertFails(deleteDoc(usersRef));
    });
  });
});
