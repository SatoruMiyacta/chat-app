import { atom } from 'jotai';

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

export const roomsAtom = atom<Rooms | null>({});
