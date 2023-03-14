import { useState, useRef } from 'react';

import { User } from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
  DocumentData,
  QueryDocumentSnapshot,
  QueryConstraint,
  where,
} from 'firebase/firestore';
import { useAtom } from 'jotai';

import { useTalkRoom } from '@/hooks';
import { db } from '@/main';
import { authUserAtom, joinedRoomListAtom, JoinedRoomData } from '@/store';
import { isCacheActive } from '@/utils';

export interface JoinedRoomsObject {
  [roomId: string]: JoinedRoomData;
}

export const useRoom = () => {
  const [authUser] = useAtom(authUserAtom);
  const [joinedRoomsList] = useAtom(joinedRoomListAtom);
  const [myRoomList, setMyRoomList] = useState<string[]>([]);

  const [lastRoom, setLastRoom] =
    useState<QueryDocumentSnapshot<DocumentData>>();

  const { getRooms, saveRooms, saveJoinedRoomsList } = useTalkRoom();

  const userRef = useRef<User>();
  const lastRoomRef = useRef<QueryDocumentSnapshot<DocumentData>>();
  const myRoomListRef = useRef<string[]>();

  if (authUser) userRef.current = authUser;
  if (lastRoomRef) lastRoomRef.current = lastRoom;
  if (myRoomList) myRoomListRef.current = myRoomList;

  const getMyRoomIdList = async (isUsedCache: boolean) => {
    // この関数はaddEventlistener内で呼ばれるため、
    // 最新のstateを参照するべくrefから取得する
    const userId = userRef.current?.uid;
    const lastUnderRoom = lastRoomRef.current;
    const joinedRoomNewIdList = myRoomListRef.current;

    if (isUsedCache && joinedRoomsList && isCacheActive(joinedRoomsList)) {
      const joinedRoomCacheIdList = joinedRoomsList?.data as string[];

      return joinedRoomCacheIdList;
    }

    if (!userId) throw new Error('ユーザー情報がありません。');

    const roomRef = collection(db, 'users', userId, 'joinedRooms');
    const queryArray: QueryConstraint[] = [
      where('isVisible', '!=', false),
      orderBy('isVisible', 'desc'),
      orderBy('updatedAt', 'desc'),
      limit(20),
    ];

    if (lastUnderRoom) queryArray.push(startAfter(lastUnderRoom));

    const querySnapshots = await getDocs(query(roomRef, ...queryArray));
    const lastVisible = querySnapshots.docs[querySnapshots.docs.length - 1];

    if (lastVisible) setLastRoom(lastVisible);

    const roomIdList: string[] = [];
    for (const doc of querySnapshots.docs) {
      const roomId = doc.id;
      roomIdList.push(roomId);
    }

    if (joinedRoomNewIdList && joinedRoomNewIdList.length !== 0) {
      setMyRoomList((prev) => {
        return Array.from(new Set([...prev, ...roomIdList]));
      });

      const newList = joinedRoomNewIdList.concat(roomIdList);
      saveJoinedRoomsList(newList);
    }

    saveJoinedRoomsList(roomIdList);

    return roomIdList;
  };

  /**
   * 取得したroomIDリストでルームIDをkeyとしたルームデータオブジェクトを返す
   */
  const getJoinedRoomData = async (userId: string, roomIdList: string[]) => {
    if (roomIdList.length === 0) return;

    const joinedRoomsObject: JoinedRoomsObject = {};
    for (const roomId of roomIdList) {
      const roomRef = doc(db, 'users', userId, 'joinedRooms', roomId);
      const querySnapshots = await getDoc(roomRef);

      const data = querySnapshots.data({ serverTimestamps: 'estimate' });

      if (!data) return;

      const dataObject: JoinedRoomData = {
        id: data.id,
        type: data.type,
        isVisible: data.isVisible,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
        lastReadAt: data.lastReadAt.toDate(),
      };

      joinedRoomsObject[roomId] = dataObject;
    }

    return joinedRoomsObject;
  };

  /**
   * 取得したroomIDリストでルームデータを保存
   */
  const saveRoomData = async (roomIdList: string[]) => {
    for (const roomId of roomIdList) {
      let roomsData = await getRooms(roomId);

      if (!roomsData) {
        const now = new Date();
        const deletedRoomsData = {
          authorId: '',
          createdAt: now,
          updatedAt: now,
        };

        roomsData = deletedRoomsData;
      }
      saveRooms(roomId, roomsData);
    }
  };

  return {
    getMyRoomIdList,
    saveRoomData,
    setMyRoomList,
    getJoinedRoomData,
    myRoomList,
    myRoomListRef,
    setLastRoom,
  };
};
