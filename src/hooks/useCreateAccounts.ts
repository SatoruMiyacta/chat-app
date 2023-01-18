import { useState } from 'react';

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useAtom } from 'jotai';

import { auth, db, storage } from '@/main';
import { UserData, usersAtom } from '@/store';
import { isValidPassword, validateEmail } from '@/utils';

export interface InitialUserData {
  userName: string;
  userIconUrl: string;
}
export const useCreateAccounts = () => {
  const [users, setUsers] = useAtom(usersAtom);
  const [userName, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');

  const isComplete = () => {
    if (!userName) return false;
    if (!validateEmail(email)) return false;
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
      iconURL: userIconUrl,
      createdAt: serverTimestamp(),
      updateAt: serverTimestamp(),
    });
  };

  // データとる、firestoreから

  const saveUsersAtom = (
    useId: string,
    { userName, userIconUrl }: InitialUserData
  ) => {
    const date = new Date();
    const userData: UserData = {
      name: userName,
      iconUrl: userIconUrl,
      createdAt: date,
      updateAt: date,
    };

    setUsers({ [useId]: { data: userData, expiresIn: date } });
  };

  return {
    users,
    saveUsersAtom,
    registerUserDate,
    signUp,
    userName,
    setName,
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
