import { User } from 'firebase/auth';
import { atom } from 'jotai';

import { CacheObject } from '@/store';

export interface UserData {
  name: string;
  iconUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserCacheObject {
  data: UserData;
  expiresIn: Date;
}

export interface Users {
  [userId: string]: UserCacheObject;
}

export interface UsersIdCacheObject {
  data: string[];
  expiresIn: Date;
}

export const authUserAtom = atom<User | null>(null);
export const usersAtom = atom<Users>({});
export const friendsIdAtom = atom<CacheObject | null>(null);
export const blockUserIdAtom = atom<CacheObject | null>(null);
