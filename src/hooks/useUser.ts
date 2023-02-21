import {
  collection,
  documentId,
  getDocs,
  query,
  where,
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
   * ユーザーを名前検索し、該当userIDを返す
   */
  const getSearchedUser = async (search: string) => {
    const searchList: string[] = [];
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(
      query(usersRef, where('name', '==', search))
    );

    for (const doc of snapshot.docs) {
      const searchId = doc.id;
      searchList.push(searchId);
    }

    return searchList;
  };

  /**
   * 名前検索したユーザーリストを受け取り、追加済みフレンドを返す
   */
  const getSearchedFriends = async (searchList: string[], userId: string) => {
    const searchedFriendsIdList: string[] = [];
    if (searchList.length === 0) return;

    const usersRef = collection(db, 'users', userId, 'friends');
    const snapshot = await getDocs(
      query(usersRef, where(documentId(), 'in', searchList))
    );

    for (const doc of snapshot.docs) {
      const searchId = doc.id;
      searchedFriendsIdList.push(searchId);
    }

    return searchedFriendsIdList;
  };

  return { getSearchedFriends, getUser, saveUser, getSearchedUser };
};
