import { useState } from 'react';

import {
  updateEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from 'firebase/auth';
import {
  doc,
  serverTimestamp,
  setDoc,
  getDoc,
  updateDoc,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useAtom } from 'jotai';

import { InitialUserData } from './useCreateAccount';

import { db, storage, auth } from '@/main';
import { authUserAtom, usersAtom, UserCacheObject } from '@/store';
import {
  isValidEmail,
  getCacheExpirationDate,
  fetchUserData,
  isCacheActive,
} from '@/utils';

export const useEditProfile = () => {
  const [authUser] = useAtom(authUserAtom);
  const [users, setUsers] = useAtom(usersAtom);
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [myIconUrl, setMyIconUrl] = useState('');
  const [userIconFile, setUserIconFile] = useState<Blob>();
  const [password, setPassword] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');

  const isComplete = () => {
    if (!userName) return false;
    if (!isValidEmail(email)) return false;

    return true;
  };

  const userId = authUser?.uid || '';

  const getUserData = async (userId: string) => {
    if (isCacheActive(users[userId])) return users[userId].data;

    const userData = await fetchUserData(userId);
    if (!userData) return;

    setUsers((prevState) => ({
      ...prevState,
      [userId]: { data: userData, expiresIn: getCacheExpirationDate() },
    }));

    return userData;
  };

  const reAuthenticate = async () => {
    if (!auth.currentUser?.email) return;
    const userEmail = auth.currentUser.email;

    const credential = EmailAuthProvider.credential(userEmail, password);
    await reauthenticateWithCredential(auth.currentUser, credential);
  };

  const uploadIcon = async (userIconFile: Blob, userId: string) => {
    if (!userIconFile) throw new Error('画像をアップロードしてください。');

    const storageRef = ref(storage, `iconImage/${userId}/userIcon`);
    await uploadBytes(storageRef, userIconFile);
    const url = await getDownloadURL(storageRef);

    return url;
  };

  const updateUserDate = async (
    userId: string,
    { userName, userIconUrl }: InitialUserData
  ) => {
    const docRef = doc(db, 'users', userId);
    const updateData = {
      name: userName,
      iconUrl: userIconUrl,
      updatedAt: serverTimestamp(),
    };
    const updateTimestamp = await updateDoc(docRef, updateData);

    console.log(updateTimestamp);
    setUsers((prevState) => ({
      ...prevState,
      [userId]: {
        data: { ...users[userId].data },
        expiresIn: getCacheExpirationDate(),
      },
    }));
  };

  return {
    reAuthenticate,
    setUserIconFile,
    updateUserDate,
    userIconFile,
    myIconUrl,
    userName,
    setUserName,
    setMyIconUrl,
    email,
    setEmail,
    isComplete,
    uploadIcon,
    setPasswordErrorMessage,
    getUserData,
    setPassword,
    passwordErrorMessage,
    password,
    userId,
  };
};
