import { atom } from 'jotai';

export interface GroupData {
  authorId: string;
  name: string;
  iconUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GroupCacheObject {
  data: GroupData;
  expiresIn: Date;
}

export interface Groups {
  [groupId: string]: GroupCacheObject;
}

export const groupsAtom = atom<Groups>({});
