import {
  collection,
  documentId,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { useAtom } from 'jotai';

import { INITIAL_ICON_URL } from '@/constants';
import { db } from '@/main';
import { usersAtom, UserData } from '@/store';
import { getCacheExpirationDate, fetchUserData, isCacheActive } from '@/utils';

export interface UserDataObject {
  [roomId: string]: UserData;
}

export const useUser = () => {
  const [users, setUsers] = useAtom(usersAtom);

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

  /**
   * 取得したIDリストでユーザーデータを保存
   */
  const saveUserData = async (useIdList: string[]) => {
    if (useIdList.length === 0) return;

    const userRef = collection(db, 'users');
    const querySnapshots = await getDocs(
      query(userRef, where(documentId(), 'in', useIdList))
    );

    const userDataObject: UserDataObject = {};
    for (const doc of querySnapshots.docs) {
      const data = doc.data();
      const id = doc.id;

      let userData;
      if (!data) {
        const now = new Date();
        userData = {
          name: '削除済みユーザー',
          iconUrl: INITIAL_ICON_URL,
          createdAt: now,
          updatedAt: now,
        };
      } else {
        userData = {
          name: data.name,
          iconUrl: data.iconUrl,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
        };
      }

      userDataObject[id] = userData;
      saveUser(id, userData);
    }

    return userDataObject;
  };

  return {
    getSearchedFriends,
    saveUserData,
    getUser,
    saveUser,
    getSearchedUser,
  };
};
