import { useAtom, useSetAtom } from 'jotai';

import {
  roomsAtom,
  joinedRoomListAtom,
  RoomData,
  joinedRoomsAtom,
  JoinedRoomData,
  MessageData,
  messagesAtom,
} from '@/store';
import { isCacheActive, getCacheExpirationDate, fetchRoom } from '@/utils';
export const useTalkRoom = () => {
  const [rooms, setRooms] = useAtom(roomsAtom);
  const setMessages = useSetAtom(messagesAtom);
  const setJoinedRooms = useSetAtom(joinedRoomsAtom);
  const setJoinedRoomsList = useSetAtom(joinedRoomListAtom);
  /**
   * ルームデータのキャッシュが古くないか
   * キャッシュが新しければグローバルstateからデータ取得。
   * 古ければfirestoreから取得
   */
  const getRooms = async (groupId: string) => {
    if (isCacheActive(rooms[groupId])) return rooms[groupId].data;

    const roomsData = await fetchRoom(groupId);
    if (!roomsData) return;

    return roomsData;
  };

  /**
   * ルームデータのグローバルstateを更新
   */
  const saveRooms = (roomId: string, roomsData: RoomData) => {
    setRooms((prevState) => ({
      ...prevState,
      [roomId]: { data: roomsData, expiresIn: getCacheExpirationDate() },
    }));
  };

  /**
   * マイルームデータのグローバルstateを更新
   */
  const saveJoinedRooms = (roomId: string, joinedRoomData: JoinedRoomData) => {
    setJoinedRooms((prevState) => ({
      ...prevState,
      [roomId]: { data: joinedRoomData, expiresIn: getCacheExpirationDate() },
    }));
  };

  /**
   * メッセージをグローバルstateに更新
   */
  const saveMessage = (messageId: string, messageData: MessageData) => {
    setMessages((prevState) => ({
      ...prevState,
      [messageId]: { data: messageData, expiresIn: getCacheExpirationDate() },
    }));
  };

  /**
   * マイルームデータリストのグローバルstateを更新
   */
  const saveJoinedRoomsList = (roomIdList: string[]) => {
    setJoinedRoomsList({
      data: roomIdList,
      expiresIn: getCacheExpirationDate(),
    });
  };
  return {
    getRooms,
    saveRooms,
    saveJoinedRooms,
    saveJoinedRoomsList,
    saveMessage,
  };
};
