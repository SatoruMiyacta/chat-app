import { useState, useRef } from 'react';

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

import { INITIAL_ICON_URL } from '@/constants';
import { useUser } from '@/hooks';
import { db } from '@/main';
import { groupsMemberAtom } from '@/store';
import { isCacheActive } from '@/utils';

export const useGroupProfile = () => {
  const [groupsMember] = useAtom(groupsMemberAtom);
  const [memberList, setMemberList] = useState<string[]>([]);
  const [lastGroupMember, setLastGroupMember] =
    useState<QueryDocumentSnapshot<DocumentData>>();
  const { getUser, saveUser } = useUser();

  const lastGroupMemberRef = useRef<QueryDocumentSnapshot<DocumentData>>();
  const memberListRef = useRef<string[]>();

  if (lastGroupMemberRef) lastGroupMemberRef.current = lastGroupMember;
  if (memberList) memberListRef.current = memberList;

  const getGroupMemberList = async (groupId: string, isUsedCache: boolean) => {
    // この関数はaddEventlistener内で呼ばれるため、
    // 最新のstateを参照するべくrefから取得する
    const lastUnderGroupMember = lastGroupMemberRef.current;
    const joinedGroupNewIdList = memberListRef.current;

    if (isUsedCache && groupsMember && isCacheActive(groupsMember.data)) {
      const joinedGroupCacheIdList = groupsMember?.data.data as string[];
      setMemberList(joinedGroupCacheIdList);

      return joinedGroupCacheIdList;
    }

    const groupRef = collection(db, 'groups', groupId, 'members');
    const queryArray: QueryConstraint[] = [
      orderBy('updatedAt', 'desc'),
      limit(15),
    ];

    if (lastUnderGroupMember) queryArray.push(startAfter(lastUnderGroupMember));

    const querySnapshots = await getDocs(query(groupRef, ...queryArray));
    const lastVisible = querySnapshots.docs[querySnapshots.docs.length - 1];
    if (lastVisible) setLastGroupMember(lastVisible);

    const groupMemberIdList: string[] = [];
    for (const doc of querySnapshots.docs) {
      const groupId = doc.id;
      groupMemberIdList.push(groupId);
    }

    if (!joinedGroupNewIdList) {
      setMemberList(groupMemberIdList);

      return groupMemberIdList;
    }

    const newList = joinedGroupNewIdList.concat(groupMemberIdList);
    setMemberList(newList);

    return newList;
  };

  /**
   * 取得したgroupMemberIDリストでユーザーデータを保存
   */
  const saveGroupMemberData = async (groupMemberIdList: string[]) => {
    for (const userId of groupMemberIdList) {
      let userData = await getUser(userId);

      if (!userData) {
        const now = new Date();
        const deletedGroupsData = {
          name: '削除済みユーザー',
          iconUrl: INITIAL_ICON_URL,
          createdAt: now,
          updatedAt: now,
        };

        userData = deletedGroupsData;
      }
      saveUser(userId, userData);
    }
  };

  return {
    getGroupMemberList,
    saveGroupMemberData,
    setMemberList,
    memberList,
  };
};
