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
  where,
  documentId,
} from 'firebase/firestore';
import { useAtom } from 'jotai';

import { INITIAL_ICON_URL } from '@/constants';
import { useUser } from '@/hooks';
import { db } from '@/main';
import { authUserAtom, blockUserIdAtom } from '@/store';
import { getCacheExpirationDate, isCacheActive } from '@/utils';

export const useBlock = () => {
  const [authUser] = useAtom(authUserAtom);
  const [blockUser, setBlockUser] = useAtom(blockUserIdAtom);
  const [blockUserList, setBlockUserList] = useState<string[]>([]);
  const [lastBlockUser, setLastBlockUser] =
    useState<QueryDocumentSnapshot<DocumentData>>();
  const { getUser, saveUser } = useUser();

  const userRef = useRef<User>();
  const lastBlockUserRef = useRef<QueryDocumentSnapshot<DocumentData>>();
  const blockUserListRef = useRef<string[]>();

  if (authUser) userRef.current = authUser;
  if (lastBlockUserRef) lastBlockUserRef.current = lastBlockUser;
  if (blockUserList) blockUserListRef.current = blockUserList;

  const getBlockUserIdList = async (isUsedCache: boolean) => {
    // この関数はaddEventlistener内で呼ばれるため、
    // 最新のstateを参照するべくrefから取得する
    const userId = userRef.current?.uid;
    const lastUnderBlockUser = lastBlockUserRef.current;
    const blockUserNewIdList = blockUserListRef.current;

    if (isUsedCache && blockUser && isCacheActive(blockUser)) {
      const blockUserCacheIdList = blockUser?.data as string[];
      setBlockUserList(blockUserCacheIdList);

      return blockUserCacheIdList;
    }

    if (!userId) throw new Error('ユーザー情報がありません。');

    const groupRef = collection(db, 'users', userId, 'blockUser');
    const queryArray: QueryConstraint[] = [
      orderBy('updatedAt', 'desc'),
      limit(10),
    ];

    if (lastUnderBlockUser) queryArray.push(startAfter(lastUnderBlockUser));

    const querySnapshots = await getDocs(query(groupRef, ...queryArray));
    const lastVisible = querySnapshots.docs[querySnapshots.docs.length - 1];
    if (lastVisible) setLastBlockUser(lastVisible);

    const blockUserIdList: string[] = [];
    for (const doc of querySnapshots.docs) {
      const groupId = doc.id;
      blockUserIdList.push(groupId);
    }

    if (!blockUserNewIdList) {
      setBlockUserList(blockUserIdList);

      return blockUserIdList;
    }

    const newList = blockUserNewIdList.concat(blockUserIdList);
    setBlockUserList(newList);

    return newList;
  };

  // 検索したグループ一覧をグローバルステートに保存して、一覧を返す
  const saveBlockUserData = async (blockUserIdList: string[]) => {
    if (!blockUserIdList || blockUserIdList.length === 0) return;

    for (const blockUserId of blockUserIdList) {
      let blockUserData = await getUser(blockUserId);

      if (!blockUserData) {
        const now = new Date();
        const deletedUserData = {
          name: '退会済みユーザー',
          iconUrl: INITIAL_ICON_URL,
          createdAt: now,
          updatedAt: now,
        };

        blockUserData = deletedUserData;
      }
      saveUser(blockUserId, blockUserData);
    }
  };
  /**
   * 名前検索したユーザーリストを受け取り、ブロックユーザーを返す
   */
  const getSearchedBlockUser = async (searchList: string[], userId: string) => {
    const searchedBlockUserIdList: string[] = [];
    if (searchList.length === 0) return;

    const usersRef = collection(db, 'users', userId, 'blockUser');
    const snapshot = await getDocs(
      query(usersRef, where(documentId(), 'in', searchList))
    );

    for (const doc of snapshot.docs) {
      const searchId = doc.id;
      searchedBlockUserIdList.push(searchId);
    }

    return searchedBlockUserIdList;
  };

  /**
   * グローバルstateの情報を更新
   */
  const saveBlockUserIdList = (blockUserIdList: string[]) => {
    setBlockUser({
      data: blockUserIdList,
      expiresIn: getCacheExpirationDate(),
    });
  };

  return {
    getBlockUserIdList,
    saveBlockUserIdList,
    setBlockUserList,
    blockUserList,
    saveBlockUserData,
    getSearchedBlockUser,
  };
};
