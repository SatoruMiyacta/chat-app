import { useState } from 'react';

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, serverTimestamp, setDoc, getDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useAtom, useSetAtom } from 'jotai';

import { auth, db, storage } from '@/main';
import { usersAtom } from '@/store';
import {
  isValidPassword,
  isValidEmail,
  getCacheExpirationDate,
  fetchUserData,
} from '@/utils';

export interface InitialUserData {
  userName: string;
  userIconUrl: string;
}
export const useCreateAccount = () => {
  const setUsers = useSetAtom(usersAtom);
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

  const uploadIcon = async (userIconFile: Blob, userId: string) => {
    if (!userIconFile) throw new Error('画像をアップロードしてください。');

    const storageRef = ref(storage, `iconImage/${userId}/userIcon`);
    await uploadBytes(storageRef, userIconFile);
    const url = await getDownloadURL(storageRef);

    return url;
  };

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

  const setUserData = async (userId: string) => {
    const userData = await fetchUserData(userId);
    if (!userData) return;

    setUsers((prevState) => ({
      ...prevState,
      [userId]: { data: userData, expiresIn: getCacheExpirationDate() },
    }));
  };

  return {
    setUserData,
    // saveUsersAtom,
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
  };
};
