import {
  collection,
  doc,
  getDoc,
  addDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
} from 'firebase/firestore';

import { db } from '@/main';

/**
 * firestoreにルームを作成する
 */
export const addRoom = async (userId: string) => {
  const collectionRef = collection(db, 'rooms');
  const querySnapshot = await addDoc(collectionRef, {
    authorId: userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  const roomId = querySnapshot.id;

  return roomId;
};

/**
 * firestoreのユーザー毎にルームを作成する
 */
export const setUsersJoinedRooms = async (userId: string, roomId: string) => {
  const docRef = doc(db, 'users', userId, 'joinedRooms', roomId);
  await setDoc(docRef, {
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

/**
 * firestoreから該当のルームを取得する
 */
export const fetchRoom = async (roomId: string) => {
  const docRef = doc(db, 'rooms', roomId);
  const docSnap = await getDoc(docRef);
  const data = docSnap.data();
  if (!data) return;

  const roomData = {
    authorId: data.authorId,
    createdAt: data.createdAt.toDate(),
    updatedAt: data.updatedAt.toDate(),
  };

  return roomData;
};

/**
 * 該当ルームのメッセージ一覧を取得。
 * 作成時間を昇順に並び替えて、10件取得
 */
export const fetchMessagesList = async (roomId: string) => {
  const messageRef = collection(db, 'rooms', roomId, 'messages');
  const querySnapshot = await getDocs(
    query(messageRef, orderBy('createdAt', 'desc'), limit(10))
  );

  return querySnapshot;
};

/**
 *該当メッセージを取得。
 */
export const fetchMessage = async (roomId: string, messageId: string) => {
  const snapshot = await getDoc(
    doc(db, 'rooms', roomId, 'messages', messageId)
  );

  const data = snapshot.data();
  return data;
};

/**
 *メッセージを作成。
 */
export const addMessage = async (
  roomId: string,
  postUserId: string,
  message: string
) => {
  const doc = collection(db, 'rooms', roomId, 'messages');
  const querySnapshot = await addDoc(doc, {
    postUserId: postUserId,
    message: message,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  const messageId = querySnapshot.id;
  return messageId;
};

/**
 *マイチャット作成
 */
export const setMyRoom = async (userId: string) => {
  const docRef = doc(db, 'rooms', userId);
  await setDoc(docRef, {
    authorId: userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return userId;
};

/**
 *マイチャットにメッセージを作成。
 */
export const addMyRoomMessage = async (userId: string, message: string) => {
  const doc = collection(db, 'rooms', userId, 'messages');
  const querySnapshot = await addDoc(doc, {
    postUserId: userId,
    message: message,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  const messageId = querySnapshot.id;
  return messageId;
};
