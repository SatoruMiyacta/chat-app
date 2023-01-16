import { useState } from 'react';

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

import { auth, db, storage } from '@/main';
import { isValidPassword, validateEmail } from '@/utils';

export interface InitialUserData {
  userName: string;
  userIconUrl: string;
}
export const useCreateAccounts = () => {
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

  const uploadIcon = async (userIconFile: Blob, userId: string) => {
    if (!userIconFile) throw new Error('画像をアップロードしてください。');

    const storageRef = ref(storage, `iconImage/${userId}/userIcon`);
    await uploadBytes(storageRef, userIconFile);
    const url = await getDownloadURL(storageRef);

    return url;
  };

  return {
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
