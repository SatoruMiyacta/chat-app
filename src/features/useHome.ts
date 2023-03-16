import { useState, useRef } from 'react';

import { User } from 'firebase/auth';
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
  DocumentData,
  QueryDocumentSnapshot,
  QueryConstraint,
} from 'firebase/firestore';
import { useAtom } from 'jotai';

import { useGroup } from '@/hooks';
import { db } from '@/main';
import { authUserAtom, joinedGroupsAtom } from '@/store';
import { getCacheExpirationDate, isCacheActive } from '@/utils';

export const useHome = () => {
  const [authUser] = useAtom(authUserAtom);
  const [joinedGroups, setJoinedGroups] = useAtom(joinedGroupsAtom);
  const [joinedGroupList, setJoinedGroupList] = useState<string[]>([]);
  const [lastGroup, setLastGroup] =
    useState<QueryDocumentSnapshot<DocumentData>>();
  const { getGroups, saveGroups, getSearchedGroup } = useGroup();

  const userRef = useRef<User>();
  const lastGroupRef = useRef<QueryDocumentSnapshot<DocumentData>>();
  const joinedGroupListRef = useRef<string[]>();

  if (authUser) userRef.current = authUser;
  if (lastGroupRef) lastGroupRef.current = lastGroup;
  if (joinedGroupList) joinedGroupListRef.current = joinedGroupList;

  const getMyGroupIdList = async (isUsedCache: boolean) => {
    // この関数はaddEventlistener内で呼ばれるため、
    // 最新のstateを参照するべくrefから取得する
    const userId = userRef.current?.uid;
    const lastUnderGroup = lastGroupRef.current;
    const joinedGroupNewIdList = joinedGroupListRef.current;

    if (isUsedCache && joinedGroups && isCacheActive(joinedGroups)) {
      const joinedGroupCacheIdList = joinedGroups?.data as string[];
      setJoinedGroupList(joinedGroupCacheIdList);

      return joinedGroupCacheIdList;
    }

    if (!userId) throw new Error('ユーザー情報がありません。');

    const groupRef = collection(db, 'users', userId, 'joinedGroups');
    const queryArray: QueryConstraint[] = [
      orderBy('updatedAt', 'desc'),
      limit(20),
    ];

    if (lastUnderGroup) queryArray.push(startAfter(lastUnderGroup));

    const querySnapshots = await getDocs(query(groupRef, ...queryArray));
    const lastVisible = querySnapshots.docs[querySnapshots.docs.length - 1];
    if (lastVisible) setLastGroup(lastVisible);

    const groupIdList: string[] = [];
    for (const doc of querySnapshots.docs) {
      const groupId = doc.id;
      groupIdList.push(groupId);
    }

    if (!joinedGroupNewIdList) {
      setJoinedGroupList(groupIdList);

      return groupIdList;
    }

    const newList = joinedGroupNewIdList.concat(groupIdList);
    setJoinedGroupList(newList);

    return newList;
  };

  // 検索したグループ一覧をグローバルステートに保存して、一覧を返す
  const searchGroupList = async (search: string) => {
    const searchList = await getSearchedGroup(search);

    for (const searchId of searchList) {
      const groupData = await getGroups(searchId);

      if (groupData) saveGroups(searchId, groupData);
    }

    return searchList;
  };

  /**
   * グローバルstateの情報を更新
   */
  const saveGroupsIdList = (groupIdList: string[]) => {
    setJoinedGroups({
      data: groupIdList,
      expiresIn: getCacheExpirationDate(),
    });
  };

  return {
    getMyGroupIdList,
    saveGroupsIdList,
    setJoinedGroupList,
    joinedGroupList,
    searchGroupList,
  };
};
