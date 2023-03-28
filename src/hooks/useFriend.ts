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
  getCountFromServer,
} from 'firebase/firestore';
import { useAtom } from 'jotai';

import { INITIAL_ICON_URL } from '@/constants';
import { JoinedRoomsDataObject } from '@/features';
import { useTalkRoom, useUser } from '@/hooks';
import { db } from '@/main';
import { authUserAtom, friendsIdAtom } from '@/store';
import {
  getCacheExpirationDate,
  isCacheActive,
  searchfriends,
  setFriend,
  searchUnAuthRoom,
  deleteUnAuthRoom,
  setUsersJoinedRooms,
  addRoom,
  setUnAuthRoom,
  getJoinedRoomData,
} from '@/utils';

/**
 * フレンドデータ一覧のキャッシュが古くないか
 * キャッシュが新しければグローバルstateからデータ取得。
 * 古ければfirestoreから取得
 */
export const useFriend = () => {
  const [lastFriend, setLastFriend] =
    useState<QueryDocumentSnapshot<DocumentData>>();
  const [authUser] = useAtom(authUserAtom);
  const [friends, setFriends] = useAtom(friendsIdAtom);
  const [friendList, setFriendList] = useState<string[]>([]);
  const { getUser, saveUser, getSearchedUser } = useUser();
  const { saveJoinedRooms } = useTalkRoom();
  const userRef = useRef<User>();
  const lastFriendRef = useRef<QueryDocumentSnapshot<DocumentData>>();
  const friendListRef = useRef<string[]>();

  if (authUser) userRef.current = authUser;
  if (lastFriendRef) lastFriendRef.current = lastFriend;
  if (friendList) friendListRef.current = friendList;

  /**
   * friendIDを取得
   */
  const getMyFriendIdList = async (isUsedCache: boolean) => {
    // この関数はaddEventlistener内で呼ばれるため、
    // 最新のstateを参照するべくrefから取得する
    const userId = userRef.current?.uid;
    const lastUnderFriend = lastFriendRef.current;
    const friendNewIdList = friendListRef.current;

    if (isUsedCache && friends && isCacheActive(friends)) {
      const friendCacheIdList = friends?.data as string[];
      setFriendList(friendCacheIdList);

      return friendCacheIdList;
    }

    if (!userId) throw new Error('ユーザー情報がありません。');

    const friendsRef = collection(db, 'users', userId, 'friends');
    const queryArray: QueryConstraint[] = [
      orderBy('updatedAt', 'desc'),
      limit(20),
    ];

    if (lastUnderFriend) queryArray.push(startAfter(lastUnderFriend));

    const querySnapshots = await getDocs(query(friendsRef, ...queryArray));

    const lastVisible = querySnapshots.docs[querySnapshots.docs.length - 1];
    if (lastVisible) setLastFriend(lastVisible);

    const friendIdList: string[] = [];
    for (const doc of querySnapshots.docs) {
      const friendId = doc.id;
      friendIdList.push(friendId);
    }

    if (!friendNewIdList) {
      setFriendList(friendIdList);

      return friendIdList;
    }

    const newList = friendNewIdList.concat(friendIdList);
    setFriendList(newList);

    return newList;
  };

  /**
   * 取得したfriendIDリストでユーザーデータを保存
   */
  const saveFriendData = async (friendIdList: string[]) => {
    for (const friendId of friendIdList) {
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
    }
  };

  /**
   * friendで検索したユーザーのIDを返す
   */
  const searchFriendsIdList = async (search: string, userId: string) => {
    const searchList = await getSearchedUser(search);
    const searchedfriendIdList = await searchfriends(searchList, userId);

    return searchedfriendIdList;
  };

  /**
   * ユーザーの友達人数を取得
   */
  const getFriendCount = async (userId: string) => {
    const collectionRef = collection(db, 'users', userId, 'friends');

    const snapshot = await getCountFromServer(collectionRef);
    const count = snapshot.data().count;

    return count;
  };

  /**
   * 友達追加
   */
  const addUserToFriend = async (userId: string, friendId: string) => {
    const type = 'user';
    const querySnapshot = await searchUnAuthRoom(userId, friendId, type);

    if (querySnapshot && querySnapshot.docs.length !== 0) {
      for (const doc of querySnapshot.docs) {
        const roomId = doc.id;
        const roomData = doc.data();
        const type = roomData.type;
        const isVisible = true;
        const anotherId = friendId;

        const joinedRoomsDataObject: JoinedRoomsDataObject = {
          anotherId,
          type,
          isVisible,
        };

        await setUsersJoinedRooms(userId, roomId, joinedRoomsDataObject);
        await deleteUnAuthRoom(userId, roomId);
      }
    } else {
      const type = 'user';
      const roomId = await addRoom(userId);
      const isVisible = true;
      const anotherId = friendId;

      const joinedRoomsDataObject: JoinedRoomsDataObject = {
        anotherId,
        type,
        isVisible,
      };

      await setUsersJoinedRooms(userId, roomId, joinedRoomsDataObject);

      const data = await getJoinedRoomData(userId, roomId);

      if (data) saveJoinedRooms(roomId, data);

      await setUnAuthRoom(userId, friendId, roomId, type);
    }

    if (friends && typeof friends !== 'undefined') {
      const friendsCacheList = friends.data as string[];
      friendsCacheList.unshift(friendId);
      saveFriendIdList(friendsCacheList);
    }

    await setFriend(userId, friendId);
  };

  /**
   * グローバルstateの情報を更新
   */
  const saveFriendIdList = (friendIdList: string[]) => {
    setFriends({
      data: friendIdList,
      expiresIn: getCacheExpirationDate(),
    });
  };

  return {
    setLastFriend,
    getMyFriendIdList,
    saveFriendIdList,
    saveFriendData,
    searchFriendsIdList,
    setFriendList,
    friendList,
    addUserToFriend,
    getFriendCount,
  };
};
