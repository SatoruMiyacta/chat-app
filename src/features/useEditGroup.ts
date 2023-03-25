import { useState, useRef } from 'react';

import {
  collection,
  doc,
  getDocs,
  serverTimestamp,
  query,
  limit,
  startAfter,
  DocumentData,
  QueryDocumentSnapshot,
  QueryConstraint,
  updateDoc,
  documentId,
  where,
} from 'firebase/firestore';
import { useAtom } from 'jotai';

import { InitialGroupData } from '@/features';
import { db } from '@/main';
import { groupsMemberAtom } from '@/store';
import { isCacheActive } from '@/utils';

export const useEditGroup = () => {
  const [groupMember] = useAtom(groupsMemberAtom);
  const [groupMemberList, setGroupMemberList] = useState<string[]>([]);
  const [lastGroupMember, setLastGroupMember] =
    useState<QueryDocumentSnapshot<DocumentData>>();
  const [groupName, setGroupName] = useState('');

  const lastGroupMemberRef = useRef<QueryDocumentSnapshot<DocumentData>>();
  const groupMemberListRef = useRef<string[]>();

  if (lastGroupMemberRef) lastGroupMemberRef.current = lastGroupMember;
  if (groupMemberList) groupMemberListRef.current = groupMemberList;

  const getGroupMemberIdList = async (
    userId: string,
    groupId: string,
    isUsedCache: boolean
  ) => {
    // この関数はaddEventlistener内で呼ばれるため、
    // 最新のstateを参照するべくrefから取得する
    const lastUnderGroup = lastGroupMemberRef.current;
    const groupMemberNewIdList = groupMemberListRef.current;

    if (isUsedCache && groupMember && isCacheActive(groupMember.data)) {
      const groupMemberCacheIdList = groupMember?.data.data as string[];
      setGroupMemberList(groupMemberCacheIdList);

      return groupMemberCacheIdList;
    }

    if (!groupId) throw new Error('グループ情報がありません。');

    const groupRef = collection(db, 'groups', groupId, 'members');
    const queryArray: QueryConstraint[] = [
      where(documentId(), '!=', userId),
      limit(20),
    ];

    if (lastUnderGroup) queryArray.push(startAfter(lastUnderGroup));

    const querySnapshots = await getDocs(query(groupRef, ...queryArray));
    const lastVisible = querySnapshots.docs[querySnapshots.docs.length - 1];
    if (lastVisible) setLastGroupMember(lastVisible);

    const groupMemberIdList: string[] = [];
    for (const doc of querySnapshots.docs) {
      const groupId = doc.id;
      groupMemberIdList.push(groupId);
    }

    if (!groupMemberNewIdList) {
      setGroupMemberList(groupMemberIdList);

      return groupMemberIdList;
    }

    const newList = groupMemberNewIdList.concat(groupMemberIdList);
    setGroupMemberList(newList);

    return newList;
  };

  const isComplete = () => {
    if (!groupName) return false;

    return true;
  };

  /**
   * 変更されたグループ情報をfirestoreに保存する。
   */
  const updateGroupDate = async (
    groupId: string,
    { groupName, groupIconUrl }: InitialGroupData
  ) => {
    const docRef = doc(db, 'groups', groupId);
    const updateData = {
      name: groupName,
      iconUrl: groupIconUrl,
      updatedAt: serverTimestamp(),
    };
    await updateDoc(docRef, updateData);
  };

  return {
    getGroupMemberIdList,
    setGroupMemberList,
    groupMemberList,
    setGroupName,
    groupName,
    isComplete,
    updateGroupDate,
    groupMemberListRef,
  };
};
