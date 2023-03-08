import { useState } from 'react';

import { deleteUser } from 'firebase/auth';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import {
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import {
  getDownloadURL,
  deleteObject,
  ref,
  uploadBytes,
} from 'firebase/storage';

import { JoinedRoomsDataObject } from '@/features';
import { auth, db, storage } from '@/main';
import {
  isValidPassword,
  isValidEmail,
  setMyRoom,
  setUsersJoinedRooms,
} from '@/utils';

export interface InitialUserData {
  userName: string;
  userIconUrl: string;
}
export const useCreateAccount = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');

  const isComplete = () => {
    if (!userName) return false;
    if (!isValidEmail(email)) return false;
    if (!isValidPassword(password)) return false;

    return true;
  };

  const signUp = async (email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    return userCredential.user;
  };

  /**
   * storageにアバターを保存し、URLを取得する。
   */
  const uploadIcon = async (userIconFile: Blob, userId: string) => {
    if (!userIconFile) throw new Error('画像をアップロードしてください。');

    const storageRef = ref(storage, `iconImage/users/${userId}/userIcon`);
    await uploadBytes(storageRef, userIconFile);
    const url = await getDownloadURL(storageRef);

    return url;
  };

  /**
   * firestoreに該当のユーザー情報を保存する
   */
  const registerUserDate = async (
    userId: string,
    { userName, userIconUrl }: InitialUserData
  ) => {
    const docRef = doc(db, 'users', userId);
    await setDoc(docRef, {
      name: userName,
      iconUrl: userIconUrl,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  };

  /**
   * 処理が失敗したときに途中まで保存したデータを消す
   */
  const deleteUserDate = async (userName: string, userIconBlob?: Blob) => {
    if (!auth.currentUser) return;

    const uid = auth.currentUser.uid;

    if (userIconBlob) {
      const desertRef = ref(storage, `iconImage/users/${uid}/userIcon`);

      if (desertRef) await deleteObject(desertRef);
    }

    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(
      query(usersRef, where('name', '==', userName))
    );

    if (snapshot.docs.length !== 0) await deleteDoc(doc(db, 'users', uid));

    await deleteUser(auth.currentUser);
  };

  /**
   * firestoreにマイチャットを作成する
   */
  const createMyRoom = async (userId: string) => {
    const type = 'user';
    const roomId = await setMyRoom(userId);

    const anotherId = userId;
    const isVisible = true;
    const joinedRoomsDataObject: JoinedRoomsDataObject = {
      anotherId,
      type,
      isVisible,
    };

    await setUsersJoinedRooms(userId, roomId, joinedRoomsDataObject);

    return roomId;
  };

  return {
    registerUserDate,
    signUp,
    userName,
    setUserName,
    email,
    setEmail,
    password,
    setPassword,
    passwordErrorMessage,
    setPasswordErrorMessage,
    isComplete,
    uploadIcon,
    createMyRoom,
    deleteUserDate,
  };
};
