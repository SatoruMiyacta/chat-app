import { useState } from 'react';

import { collection, getDocs, query, where } from 'firebase/firestore';
import { useAtom } from 'jotai';

import { INITIAL_ICON_URL } from '@/constants';
import { useUser, useGroup } from '@/hooks';
import { db } from '@/main';
import { authUserAtom, usersAtom, groupsAtom, joinedGroupsAtom } from '@/store';

export const useSearch = () => {
  const [users, setUsers] = useAtom(usersAtom);
  const [groupsId, setGroupsId] = useAtom(joinedGroupsAtom);
  const { getUser, saveUser, getSearchedFriends, getSearchedUser } = useUser();
  const { getGroups, saveGroups } = useGroup();

  // 検索したユーザー一覧をグローバルステートに保存して、一覧を返す
  const searchUserList = async (search: string) => {
    const searchList = await getSearchedUser(search);

    for (const searchId of searchList) {
      const userData = await getUser(searchId);

      if (userData) saveUser(searchId, userData);
    }

    return searchList;
  };

  const convertnotFriendsObject = async (
    searchList: string[],
    userId: string
  ) => {
    const searchedFriendsIdList = await getSearchedFriends(searchList, userId);

    if (!searchedFriendsIdList) return;

    const notFriends = searchList.filter(
      (i) => searchedFriendsIdList.indexOf(i) == -1
    );
    const notFriendsObject = notFriends.reduce((accumulater, value) => {
      return { ...accumulater, [value]: true };
    }, {});

    return notFriendsObject;
  };

  return { convertnotFriendsObject, searchUserList };
};
