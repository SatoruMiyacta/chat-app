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
import { useAtomValue } from 'jotai';

import { InitialUserData } from './useCreateAccount';

import { db, storage, auth } from '@/main';
import { authUserAtom, usersAtom } from '@/store';
import { validateEmail } from '@/utils';

export const useEditProfile = () => {
  const authUser = useAtomValue(authUserAtom);
  const users = useAtomValue(usersAtom);
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [myIconUrl, setMyIconUrl] = useState('');
  const [userIconFile, setUserIconFile] = useState<Blob>();

  const isComplete = () => {
    if (!userName) return false;
    if (!validateEmail(email)) return false;

    return true;
  };

  const setInitialDate = () => {
    if (authUser) {
      const userId = authUser.uid;

      if (userName === '') setUserName(users[userId].data.name);

      if (myIconUrl === '') setMyIconUrl(users[userId].data.iconUrl);

      const userEmail = authUser.email;
      if (!userEmail) return;
      if (email === '') setEmail(userEmail);
    }
  };

  // const reAuthenticate = async () => {
  //   if (!auth.currentUser?.email) return;
  //   const userEmail = auth.currentUser.email

  //   const credential = EmailAuthProvider.credential(
  //     userEmail,
  //     userProvidedPassword
  // )
  // const result = await reauthenticateWithCredential(
  //     auth.currentUser,
  //     credential
  // )
  // };

  const uploadIcon = async (userIconFile: Blob, userId: string) => {
    if (!userIconFile) throw new Error('画像をアップロードしてください。');

    const storageRef = ref(storage, `iconImage/${userId}/userIcon`);
    await uploadBytes(storageRef, userIconFile);
    const url = await getDownloadURL(storageRef);

    return url;
  };

  const updateUserDate = async (
    useId: string,
    { userName, userIconUrl }: InitialUserData
  ) => {
    const docRef = doc(db, 'users', useId);
    await updateDoc(docRef, {
      name: userName,
      iconUrl: userIconUrl,
      updateAt: serverTimestamp(),
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
    setUserIconFile,
    getUserData,
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
    setInitialDate,
  };
};
