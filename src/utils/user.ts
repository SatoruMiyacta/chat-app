import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  deleteDoc,
} from 'firebase/firestore';

import { db } from '@/main';
import { UserData } from '@/store';

/**
 * firestoreから該当のユーザー情報を取得する
 */
export const fetchUserData = async (userId: string) => {
  const docRef = doc(db, 'users', userId);
  const docSnap = await getDoc(docRef);
  const data = docSnap.data();
  if (!data) return;

  const userData: UserData = {
    name: data.name,
    iconUrl: data.iconUrl,
    createdAt: data.createdAt.toDate(),
    updatedAt: data.updatedAt.toDate(),
  };

  return userData;
};

export const setUsersBlockUser = async (
  userId: string,
  blockUserId: string
) => {
  const docRef = doc(db, 'users', userId, 'blockUser', blockUserId);
  await setDoc(docRef, {
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

export const deleteBlockUser = async (userId: string, blockUserId: string) => {
  const docRef = doc(db, 'users', userId, 'blockUser', blockUserId);
  await deleteDoc(docRef);
};
