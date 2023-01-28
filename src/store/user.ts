import { User } from 'firebase/auth';
import { atom } from 'jotai';

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

export const authUserAtom = atom<User | null>(null);
export const usersAtom = atom<Users>({});
