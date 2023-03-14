import {
  collection,
  doc,
  getDoc,
  addDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  query,
  where,
  deleteDoc,
  documentId,
  WriteBatch,
  getCountFromServer,
  updateDoc,
} from 'firebase/firestore';

import { JoinedRoomsObject, JoinedRoomsDataObject } from '@/features';
import { db } from '@/main';
import { JoinedRoomData } from '@/store';

/**
 * 自分のunAuthRoomを取得
 */
export const getUnAuthRoom = async (userId: string, roomId: string) => {
  const docRef = doc(db, 'users', userId, 'unAuthRoom', roomId);
  const querySnapshot = await getDoc(docRef);
  const data = querySnapshot.data();

  if (!data) return;

  return data;
};

/**
 * 自分のunAuthRoomに友達追加する相手から承認待ちメッセージが来ていないか確認
 * 該当ルームがあったら返す
 */
export const searchUnAuthRoom = async (
  userId: string,
  anotherId: string,
  type: string
) => {
  const collectionRef = collection(db, 'users', userId, 'unAuthRoom');
  const querySnapshot = await getDocs(
    query(
      collectionRef,
      where('type', '==', type),
      where('id', '==', anotherId)
    )
  );

  if (querySnapshot) return querySnapshot;
};

/**
 * unAuthRoomにroomIDがあるかどうか
 *
 */
export const existUnAuthRoom = async (userId: string, roomId: string) => {
  const collectionRef = collection(db, 'users', userId, 'unAuthRoom');
  const querySnapshot = await getDocs(
    query(collectionRef, where(documentId(), '==', roomId))
  );

  return querySnapshot;
};

/**
 * 自分のunAuthRoomリストを取得
 */
export const getUnAuthRoomList = async (userId: string) => {
  const collectionRef = collection(db, 'users', userId, 'unAuthRoom');
  const querySnapshot = await getDocs(collectionRef);

  const unAuthRoomIdList = [];
  for (const doc of querySnapshot.docs) {
    const unAuthRoomId = doc.id;
    unAuthRoomIdList.push(unAuthRoomId);
  }

  return unAuthRoomIdList;
};

/**
 * 自分のunAuthRoomデータを取得
 */
export const getUnAuthRoomData = async (
  userId: string,
  roomIdList: string[]
) => {
  const unAuthRoomsObject: JoinedRoomsObject = {};

  for (const roomId of roomIdList) {
    const docRef = doc(db, 'users', userId, 'unAuthRoom', roomId);
    const querySnapshots = await getDoc(docRef);

    const data = querySnapshots.data();

    if (!data) return;

    const dataObject: JoinedRoomData = {
      id: data.id,
      type: data.type,
      isVisible: data.isVisible,
      lastReadAt: data.lastReadAt.toDate(),
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
    };

    unAuthRoomsObject[roomId] = dataObject;
  }

  return unAuthRoomsObject;
};

/**
 * 自分以外のunAuthRoomに承認待ちroomを作成
 */
export const setUnAuthRoom = async (
  userId: string,
  anotherId: string,
  roomId: string,
  type: string
) => {
  const docRef = doc(db, 'users', anotherId, 'unAuthRoom', roomId);
  await setDoc(docRef, {
    id: userId,
    type: type,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    isVisible: true,
    lastReadAt: serverTimestamp(),
  });
};

/**
 * IDリストを受け取り、unAuthRoomに承認待ちroomを作成
 */
export const setUsersUnAuthRoom = async (
  userId: string,
  anotherUserIdList: string[],
  roomId: string,
  type: string,
  batch: WriteBatch
) => {
  for (const anotherUserId of anotherUserIdList) {
    const docRef = doc(db, 'users', anotherUserId, 'unAuthRoom', roomId);
    batch.set(docRef, {
      id: userId,
      type: type,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      isVisible: true,
      lastReadAt: serverTimestamp(),
    });
  }
};

/**
 * 自分のunAuthRoomから該当ルームを消す
 */
export const deleteUnAuthRoom = async (userId: string, roomId: string) => {
  const docRef = doc(db, 'users', userId, 'unAuthRoom', roomId);
  await deleteDoc(docRef);
};

/**
 * firestoreにルームを作成する
 */
export const setRoom = async (
  userId: string,
  roomId: string,
  batch: WriteBatch
) => {
  const docRef = doc(db, 'rooms', roomId);
  batch.set(docRef, {
    authorId: userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

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
export const setUsersJoinedRooms = async (
  userId: string,
  roomId: string,
  { anotherId, type, isVisible }: JoinedRoomsDataObject,
  batch?: WriteBatch
) => {
  const docRef = doc(db, 'users', userId, 'joinedRooms', roomId);

  if (batch) {
    batch.set(docRef, {
      id: anotherId,
      type: type,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      isVisible: isVisible,
      lastReadAt: serverTimestamp(),
    });
  } else {
    await setDoc(docRef, {
      id: anotherId,
      type: type,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      isVisible: isVisible,
      lastReadAt: serverTimestamp(),
    });
  }
};

/**
 * ルームのisVisibleを変える
 */
export const updateJoinedRoomsIsVisible = async (
  userId: string,
  roomId: string,
  isVisible: boolean
) => {
  const docRef = doc(db, 'users', userId, 'joinedRooms', roomId);
  await updateDoc(docRef, {
    updatedAt: serverTimestamp(),
    isVisible: isVisible,
  });
};

/**
 * 最後のメッセージ取得時間を保存
 */
export const updateLastReadAt = async (userId: string, roomId: string) => {
  const docRef = doc(db, 'users', userId, 'joinedRooms', roomId);
  await updateDoc(docRef, {
    lastReadAt: serverTimestamp(),
  });
};

/**
 * メッセージ更新時にトークメンバーのjoineRoomsを更新
 */
export const updateJoinedRoomsUpdatedAt = async (
  userId: string,
  roomId: string
) => {
  const docRef = doc(db, 'users', userId, 'joinedRooms', roomId);
  if (!docRef.id) return;

  await updateDoc(docRef, {
    updatedAt: serverTimestamp(),
  });
};

/**
 * joineRoomsのdataを取得
 */
export const getJoinedRoomData = async (userId: string, roomId: string) => {
  const docRef = doc(db, 'users', userId, 'joinedRooms', roomId);
  const querySnapshots = await getDoc(docRef);

  const data = querySnapshots.data();

  if (!data) return;

  const joinedRoomsData = {
    id: data.id,
    type: data.type,
    createdAt: data.createdAt.toDate(),
    updatedAt: data.updatedAt.toDate(),
    isVisible: data.isVisible,
    lastReadAt: data.lastReadAt.toDate(),
  };

  return joinedRoomsData;
};

/**
 * 自分のjoinedRoomに該当のルームがあるか確認
 */
export const searchMyJoinedRoom = async (userId: string, roomId: string) => {
  const collectionRef = collection(db, 'users', userId, 'joinedRooms');
  const querySnapshot = await getDocs(
    query(collectionRef, where(documentId(), '==', roomId))
  );

  if (querySnapshot) return querySnapshot;
};

/**
 * 自分のjoinedRoomのフィールドを検索し、該当IDとのroomIDを返す
 */
export const searchRoomId = async (userId: string, searchId: string) => {
  const collectionRef = collection(db, 'users', userId, 'joinedRooms');
  const querySnapshot = await getDocs(
    query(collectionRef, where('id', '==', searchId))
  );

  let roomId;
  for (const doc of querySnapshot.docs) {
    roomId = doc.id;
  }
  return roomId;
};

/**
 * 未読件数を返す
 */
export const getUnReadCount = async (roomId: string) => {
  const date = new Date();
  const collectionRef = collection(db, 'rooms', roomId, 'messages');
  const query_ = query(collectionRef, where('createdAt', '>=', date));
  const snapshot = await getCountFromServer(query_);

  return snapshot.data().count;
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
 *該当メッセージを取得。
 */
export const fetchMessage = async (roomId: string, messageId: string) => {
  const snapshot = await getDoc(
    doc(db, 'rooms', roomId, 'messages', messageId)
  );

  const data = snapshot.data();

  if (!data) return;

  const messageData = {
    postUserId: data.postUserId,
    message: data.message,
    createdAt: data.createdAt.todate(),
    updatedAt: data.updatedAt.todate(),
  };
  return messageData;
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
 *メッセージを作成。
 */
export const addMyRoomMessage = async (
  userId: string,
  roomId: string,
  message: string
) => {
  const doc = collection(db, 'rooms', roomId, 'messages');

  const querySnapshot = await addDoc(doc, {
    postUserId: userId,
    message: message,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  const messageId = querySnapshot.id;
  return messageId;
};

/**
 * 自分のjoinedRoomsから該当ルームを消す
 */
export const deleteJoinedRooms = async (userId: string, roomId: string) => {
  const docRef = doc(db, 'users', userId, 'joinedRooms', roomId);
  await deleteDoc(docRef);
};

/**
 * roomsから該当ルームを消す
 */
export const deleteRooms = async (roomId: string) => {
  const docRef = doc(db, 'rooms', roomId);
  await deleteDoc(docRef);
};
