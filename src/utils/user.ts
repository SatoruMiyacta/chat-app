import { doc, getDoc } from 'firebase/firestore';

import { db } from '@/main';
import { UserData } from '@/store';
import { UserCacheObject } from '@/store';

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

export const isCacheActive = (userObject: UserCacheObject) => {
  const now = new Date();
  const isCacheActive = userObject?.expiresIn > now;
  return isCacheActive;
};
