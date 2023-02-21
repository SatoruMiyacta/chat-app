import { getDocs, collection, doc, getDoc } from 'firebase/firestore';

import { db } from '@/main';
import { UserData } from '@/store';
import { UserCacheObject, UsersIdCacheObject } from '@/store';

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

// /**
//  * 全ユーザーIDのキャッシュ（expiresIn）が有効期限内であればtrueを返す
//  */
// export const isUsersIdCacheActive = (usersId: UsersIdCacheObject) => {
//   const now = new Date();
//   const isCacheActive = usersId?.expiresIn > now;

//   return isCacheActive;
// };
