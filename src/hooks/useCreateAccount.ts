import { useState } from 'react';

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, serverTimestamp, setDoc, getDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useAtom } from 'jotai';

import { auth, db, storage } from '@/main';
import { UserData, usersAtom } from '@/store';
import { isValidPassword, isValidEmail } from '@/utils';

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

  const uploadIcon = async (userIconFile: Blob, userId: string) => {
    if (!userIconFile) throw new Error('画像をアップロードしてください。');

    const storageRef = ref(storage, `iconImage/${userId}/userIcon`);
    await uploadBytes(storageRef, userIconFile);
    const url = await getDownloadURL(storageRef);

    return url;
  };

  const registerUserDate = async (
    useId: string,
    { userName, userIconUrl }: InitialUserData
  ) => {
    const docRef = doc(db, 'users', useId);
    await setDoc(docRef, {
      name: userName,
      iconUrl: userIconUrl,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  };

  const getUserData = async (useId: string) => {
    const docRef = doc(db, 'users', useId);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();
    if (!data) return;

    return data;
  };

  return {
    getUserData,
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
