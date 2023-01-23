import { User } from 'firebase/auth';
import { atom } from 'jotai';

export interface UserData {
  name: string;
  iconUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Users {
  [userId: string]: { data: UserData; expiresIn: Date };
}

export const authUserAtom = atom<User | null>(null);
export const usersAtom = atom<Users>({});

// キャッシュが保存された時間を格納。
// export const cacheData = atom()

// 他ユーザーの情報をどうゆう状態で保存するか
// export const friendsData = atom<User | null>(null)

// const hoge = [
//   {
//     id: 'aaaaaaaa',
//     name: 'a',
//     iconUrl: 'aaa',
//     createdAt: Timestamp,
//     updatedAt: Timestamp,
//   },
//   {
//     id: 'bbbbbbbb',
//     name: 'b',
//     iconUrl: 'bbb',
//     createdAt: Timestamp,
//     updatedAt: Timestamp,
//   },
//   {
//     id: 'cccccccc',
//     name: 'c',
//     iconUrl: 'ccc',
//     createdAt: Timestamp,
//     updatedAt: Timestamp,
//   },
// ];

// hoge.map((data, index) => {
//   if (data.id === 'bbbbbbbb') return;
// });

// const hogehoge = {
//   aaa: {
//     name: 'c',
//     iconUrl: 'ccc',
//     createdAt: Timestamp,
//     updatedAt: Timestamp,
//     accessTime: Date,
//   },
//   bbb: {
//     name: 'c',
//     iconUrl: 'ccc',
//     createdAt: Timestamp,
//     updatedAt: Timestamp,
//     accessTime: Date,
//   },
//   ccc: {
//     name: 'c',
//     iconUrl: 'ccc',
//     createdAt: Timestamp,
//     updatedAt: Timestamp,
//     accessTime: Date,
//   },
// };

// hogehoge.aaa;

// users/myId/friendsの部分にIdを保存する。
// そのfriendsを一度取得して状態管理しておく。
// 必要なときに、Idを参照してユーザー情報を取得。
// その際、セキュリティルールが必要？。
