import { useState } from 'react';

import {
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  query,
  orderBy,
  limit,
  where,
  documentId,
} from 'firebase/firestore';
import { useAtom } from 'jotai';

import { db } from '@/main';
import { groupsAtom, usersAtom, GroupData, joinedGroupsAtom } from '@/store';
import {
  getCacheExpirationDate,
  fetchGroupsData,
  isCacheActive,
} from '@/utils';

export const useGroup = () => {
  const [groups, setGroups] = useAtom(groupsAtom);
  const [groupList, setGroupList] = useState<string[]>([]);
  const [joinedGroups, setJoinedGroups] = useAtom(joinedGroupsAtom);

  /**
   * グループを名前検索し、該当groupIDを返す
   */
  const getSearchedGroup = async (search: string) => {
    const searchList: string[] = [];
    const groupRef = collection(db, 'groups');
    const snapshot = await getDocs(
      query(groupRef, where('name', '==', search))
    );

    for (const doc of snapshot.docs) {
      const searchId = doc.id;
      searchList.push(searchId);
    }

    return searchList;
  };

  /**
   * 名前検索したグループリストを受け取り、追加済みグループを返す
   */
  const getSearchedGroups = async (searchList: string[], userId: string) => {
    const searchedGroupsIdList: string[] = [];
    if (searchList.length === 0) return;

    const usersRef = collection(db, 'users', userId, 'joinedGroups');
    const snapshot = await getDocs(
      query(usersRef, where(documentId(), 'in', searchList))
    );

    for (const doc of snapshot.docs) {
      const searchId = doc.id;
      searchedGroupsIdList.push(searchId);
    }

    return searchedGroupsIdList;
  };

  /**
   * グループデータのキャッシュが古くないか
   * キャッシュが新しければグローバルstateからデータ取得。
   * 古ければfirestoreから取得
   */
  const getGroups = async (groupId: string) => {
    if (isCacheActive(groups[groupId])) return groups[groupId].data;

    const groupsData = await fetchGroupsData(groupId);
    if (!groupsData) return;

    return groupsData;
  };

  /**
   * グループデータのグローバルstateを更新
   */
  const saveGroups = (groupId: string, groupsData: GroupData) => {
    setGroups((prevState) => ({
      ...prevState,
      [groupId]: { data: groupsData, expiresIn: getCacheExpirationDate() },
    }));
  };

  /**
   * ユーザーグループデータのグローバルstateを更新
   */
  const saveJoinedGroups = (groupIdList: string[]) => {
    setJoinedGroups({
      data: groupIdList,
      expiresIn: getCacheExpirationDate(),
    });
  };

  return {
    getSearchedGroups,
    getGroups,
    saveGroups,
    saveJoinedGroups,
    getSearchedGroup,
  };
};
