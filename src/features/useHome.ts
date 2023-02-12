import { useState } from 'react';

import {
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import { useAtom } from 'jotai';

import { INITIAL_ICON_URL } from '@/constants';
import { useUser, useGroup } from '@/hooks';
import { db } from '@/main';
import { authUserAtom, usersAtom } from '@/store';
import { getCacheExpirationDate, fetchUserData, isCacheActive } from '@/utils';

export const useHome = () => {
  const [users, setUsers] = useAtom(usersAtom);
  const { getUser, saveUser, fetchfriendsData, fetchGroupsData } = useUser();
  const { getGroups, saveGroups } = useGroup();

  const getFriendIdList = async (userId: string) => {
    const querySnapshot = await fetchfriendsData(userId);
    const friendIdList: string[] = [];

    querySnapshot.forEach(async (doc) => {
      const friendId = doc.id;
      friendIdList.push(friendId);

      let friendUserData = await getUser(friendId);

      if (!friendUserData) {
        const now = new Date();
        const deletedUserData = {
          name: '退会済みユーザー',
          iconUrl: INITIAL_ICON_URL,
          createdAt: now,
          updatedAt: now,
        };

        friendUserData = deletedUserData;
      }
      saveUser(friendId, friendUserData);
    });

    return friendIdList;
  };

  const getGroupIdList = async (userId: string) => {
    const querySnapshot = await fetchGroupsData(userId);
    const groupIdList: string[] = [];

    querySnapshot.forEach(async (doc) => {
      const groupId = doc.id;
      groupIdList.push(groupId);

      let groupsData = await getGroups(groupId);

      if (!groupsData) {
        const now = new Date();
        const deletedGroupsData = {
          authorId: '',
          name: '削除済みグループ',
          iconUrl: INITIAL_ICON_URL,
          createdAt: now,
          updatedAt: now,
        };

        groupsData = deletedGroupsData;
      }
      saveGroups(groupId, groupsData);
    });

    return groupIdList;
  };

  return { getGroupIdList, getFriendIdList };
};
