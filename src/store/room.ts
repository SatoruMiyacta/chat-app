import { atom } from 'jotai';

import { CacheObject } from '@/store';
export interface RoomData {
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RoomCacheObject {
  data: RoomData;
  expiresIn: Date;
}

export interface Rooms {
  [roomId: string]: RoomCacheObject;
}

export interface JoinedRoomData {
  id: string;
  type: string;
  isVisible: boolean;
  lastReadAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface JoinedRoomCacheObject {
  data: JoinedRoomData;
  expiresIn: Date;
}

export interface JoinedRooms {
  [roomId: string]: JoinedRoomCacheObject;
}

export interface MessageData {
  postUserId: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MessageCacheObject {
  data: MessageData;
  expiresIn: Date;
}

export interface Messages {
  [messageId: string]: MessageCacheObject;
}

export const roomsAtom = atom<Rooms>({});
export const joinedRoomsAtom = atom<JoinedRooms>({});
export const joinedRoomListAtom = atom<CacheObject | null>(null);
export const messagesAtom = atom<Messages>({});
export const messagesListAtom = atom<CacheObject | null>(null);
