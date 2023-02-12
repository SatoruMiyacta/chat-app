import {
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import { useAtom } from 'jotai';

import { db } from '@/main';
import { authUserAtom, usersAtom, UserData } from '@/store';
import { getCacheExpirationDate, fetchUserData, isCacheActive } from '@/utils';

export const useUser = () => {
  const [users, setUsers] = useAtom(usersAtom);
  const [authUser] = useAtom(authUserAtom);

  /**
   * ユーザーデータのキャッシュが古くないか
   * キャッシュが新しければグローバルstateからデータ取得。
   * 古ければfirestoreから取得
   */
  const getUser = async (userId: string) => {
    if (isCacheActive(users[userId])) return users[userId].data;

    const userData = await fetchUserData(userId);
    if (!userData) return;

    return userData;
  };

  /**
   * グローバルstateの情報を更新
   */
  const saveUser = (userId: string, userData: UserData) => {
    setUsers((prevState) => ({
      ...prevState,
      [userId]: { data: userData, expiresIn: getCacheExpirationDate() },
    }));
  };

  /**
   * ユーザーのfriendデータをfirestoreから取得
   */
  const fetchfriendsData = async (userId: string) => {
    const querySnapshot = await getDocs(
      collection(db, 'users', userId, 'friends')
    );
    return querySnapshot;
  };

  /**
   * ユーザーのgroupデータをfirestoreから取得
   */
  const fetchGroupsData = async (userId: string) => {
    const querySnapshot = await getDocs(
      collection(db, 'users', userId, 'groups')
    );

    return querySnapshot;
  };

  return { getUser, saveUser, fetchfriendsData, fetchGroupsData };
};
