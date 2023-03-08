import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  RulesTestEnvironment,
} from '@firebase/rules-unit-testing';

import {
  setDoc,
  getDoc,
  deleteDoc,
  doc,
  serverTimestamp,
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

const setFriend = async (userId: string) => {
  await testEnv.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    const friendsRef = doc(db, 'users', userId, 'friends', uuidv4());
    await setDoc(friendsRef, {
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  });
};

describe('/users/{userId}/friends/{friendUserId}', () => {
  describe('read', () => {
    it('自分は読み込み可。', async () => {
      const userId = uuidv4();
      await setFriend(userId);

      const context = testEnv.authenticatedContext(userId);
      const db = context.firestore();
      const usersRef = doc(db, 'users', userId, 'friends', uuidv4());
      await assertSucceeds(getDoc(usersRef));
    });

    it('自分以外は読み込み不可。', async () => {
      const userId = uuidv4();
      await setFriend(userId);

      const context = testEnv.authenticatedContext(uuidv4());
      const db = context.firestore();
      const usersRef = doc(db, 'users', userId, 'friends', uuidv4());
      await assertFails(getDoc(usersRef));
    });
  });

  describe('create', () => {
    it('自分は友達追加可。', async () => {
      const userId = uuidv4();
      const context = testEnv.authenticatedContext(userId);
      const db = context.firestore();
      const usersRef = doc(db, 'users', userId, 'friends', uuidv4());
      await assertSucceeds(
        setDoc(usersRef, {
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      );
    });

    it('自分以外は友達追加不可。', async () => {
      const userId = uuidv4();
      const context = testEnv.authenticatedContext(userId);
      const db = context.firestore();
      const usersRef = doc(db, 'users', uuidv4(), 'friends', userId);
      await assertFails(
        setDoc(usersRef, {
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      );
    });
  });

  describe('delete', () => {
    it('自分は削除可。', async () => {
      const userId = uuidv4();
      await setFriend(userId);

      const context = testEnv.authenticatedContext(userId);
      const db = context.firestore();
      const usersRef = doc(db, 'users', userId, 'friends', uuidv4());
      await assertSucceeds(deleteDoc(usersRef));
    });

    it('自分以外は削除不可。', async () => {
      const userId = uuidv4();
      await setFriend(userId);

      const context = testEnv.authenticatedContext(uuidv4());
      const db = context.firestore();
      const usersRef = doc(db, 'users', userId, 'friends', uuidv4());
      await assertFails(deleteDoc(usersRef));
    });
  });
});
