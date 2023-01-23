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

describe('/users/{userId} create', () => {
  it('認証userはデータ追加可。', async () => {
    const context = testEnv.authenticatedContext('alice');
    const db = context.firestore();
    const usersRef = doc(db, 'users', 'alice');
    await assertSucceeds(
      setDoc(usersRef, {
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
    const usersRef = doc(db, 'users', 'alice');
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

describe('/users/{userId} read', () => {
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

describe('/users/{userId} update', () => {
  beforeEach(async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      const db = context.firestore();
      const usersRef = doc(db, 'users', 'alice');
      await setDoc(usersRef, {
        name: 'hoge',
        updatedAt: serverTimestamp(),
      });
    });
  });

  it('user本人はデータ更新可。', async () => {
    const context = testEnv.authenticatedContext('alice');
    const db = context.firestore();
    const usersRef = doc(db, 'users', 'alice');
    await assertSucceeds(
      updateDoc(usersRef, {
        name: 'hogehoge',
        updatedAt: serverTimestamp(),
      })
    );
  });

  it('user以外はデータ更新不可。', async () => {
    const context = testEnv.unauthenticatedContext();
    const db = context.firestore();
    const usersRef = doc(db, 'users', 'bob');
    await assertFails(
      updateDoc(usersRef, {
        name: 'hogehoge',
        updatedAt: serverTimestamp(),
      })
    );
  });
});

describe('/users/{userId} delete', () => {
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

  it('user以外はデータ削除不可。', async () => {
    const context = testEnv.unauthenticatedContext();
    const db = context.firestore();
    const usersRef = doc(db, 'users', 'bob');
    await assertFails(deleteDoc(usersRef));
  });
});
