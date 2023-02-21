import {
  getDocs,
  collection,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  query,
  orderBy,
  limit,
  startAfter,
  QuerySnapshot,
  where,
  DocumentData,
} from 'firebase/firestore';

import { db } from '@/main';

/**
 * firestoreに友達追加する
 */
export const setFriend = async (userId: string, friendId: string) => {
  const docRef = doc(db, 'users', userId, 'friends', friendId);
  await setDoc(docRef, {
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

/**
 * ユーザーのfriendデータ一覧をfirestoreから取得
 */
export const fetchfriendsFirstData = async (userId: string) => {
  const friendsRef = collection(db, 'users', userId, 'friends');
  const querySnapshots = await getDocs(
    query(friendsRef, orderBy('updatedAt', 'desc'), limit(15))
  );

  return querySnapshots;
};

/**
 * firestoreから次のfriendデータ一覧を取得
 */
export const fetchNextfriendsData = async (
  userId: string,
  querySnapshots: QuerySnapshot<DocumentData>
) => {
  const friendsRef = collection(db, 'users', userId, 'friends');

  const lastVisible = querySnapshots.docs[querySnapshots.docs.length - 1];

  const nextDocumentSnapshots = await getDocs(
    query(
      friendsRef,
      orderBy('updatedAt', 'desc'),
      startAfter(lastVisible),
      limit(15)
    )
  );

  return nextDocumentSnapshots;
};

/**
 * 検索した該当ユーザーがフレンドにいたら返す
 */
export const searchfriends = async (searchIdList: string[], userId: string) => {
  const searchedfriendIdList: string[] = [];

  for (const searchId of searchIdList) {
    const friendsRef = doc(db, 'users', userId, 'friends', searchId);

    if (friendsRef) searchedfriendIdList.push(searchId);
  }

  return searchedfriendIdList;
};
