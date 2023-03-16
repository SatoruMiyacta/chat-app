import { atom } from 'jotai';

import { CacheObject } from '@/store';

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

export interface GroupMember {
  [groupId: string]: CacheObject;
}

export const groupsAtom = atom<Groups>({});
export const joinedGroupsAtom = atom<CacheObject | null>(null);
export const groupsMemberAtom = atom<GroupMember>({});
