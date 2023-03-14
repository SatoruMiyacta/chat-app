import {
  collection,
  getDocs,
  query,
  where,
  documentId,
} from 'firebase/firestore';
import { useAtom, useSetAtom } from 'jotai';

import { INITIAL_ICON_URL } from '@/constants';
import { db } from '@/main';
import {
  groupsAtom,
  GroupData,
  joinedGroupsAtom,
  groupsMemberAtom,
} from '@/store';
import {
  getCacheExpirationDate,
  fetchGroupsData,
  isCacheActive,
  fetchGroupsMember,
} from '@/utils';
export interface UserAndGroupId {
  userId?: string;
  groupId: string;
}
export const useGroup = () => {
  const [groups, setGroups] = useAtom(groupsAtom);
  const [groupMember, setGroupMember] = useAtom(groupsMemberAtom);
  const setJoinedGroups = useSetAtom(joinedGroupsAtom);

  /**
   * 取得したgroupIDリストでグループデータを保存
   */
  const saveGroupData = async (groupIdList: string[]) => {
    if (groupIdList.length === 0) return;

    const userRef = collection(db, 'groups');
    const querySnapshots = await getDocs(
      query(userRef, where(documentId(), 'in', groupIdList))
    );
    for (const doc of querySnapshots.docs) {
      const data = doc.data({ serverTimestamps: 'estimate' });
      const id = doc.id;

      let groupData;
      if (!data) {
        const now = new Date();
        groupData = {
          authorId: '',
          name: '削除済みグループ',
          iconUrl: INITIAL_ICON_URL,
          createdAt: now,
          updatedAt: now,
        };
      } else {
        groupData = {
          authorId: data.authorId,
          name: data.name,
          iconUrl: data.iconUrl,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
        };
      }

      if (groupData) saveGroups(id, groupData);
    }
  };
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
   * 検索したリストを受け取り、追加済みグループを返す
   */
  const getSearchedJoinedGroups = async (
    searchList: string[],
    userId: string
  ) => {
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

    const data = await fetchGroupsData(groupId);
    if (!data) return;

    const groupData = {
      authorId: data.authorId,
      name: data.name,
      iconUrl: data.iconUrl,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };

    return groupData;
  };

  /**
   * グループメンバーデータのキャッシュが古くないか
   * キャッシュが新しければグローバルstateからデータ取得。
   * 古ければfirestoreから取得
   */
  const getGroupsMember = async (groupId: string) => {
    if (groupMember && isCacheActive(groupMember.data))
      return groupMember.data.data as string[];

    const querySnapshot = await fetchGroupsMember(groupId);
    const memberIdList = [];
    for (const doc of querySnapshot.docs) {
      const memberId = doc.id;
      memberIdList.push(memberId);
    }

    return memberIdList;
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

  /**
   * グローバルstateの情報を更新
   */
  const saveGroupsMemberIdList = (
    groupId: string,
    groupMemberIdList: string[]
  ) => {
    setGroupMember((prev) => ({
      ...prev,
      [groupId]: {
        data: groupMemberIdList,
        expiresIn: getCacheExpirationDate(),
      },
    }));
  };

  return {
    getSearchedJoinedGroups,
    getGroups,
    saveGroups,
    saveJoinedGroups,
    getSearchedGroup,
    saveGroupData,
    saveGroupsMemberIdList,
    getGroupsMember,
  };
};
