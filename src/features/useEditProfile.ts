import { useState } from 'react';

import { EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useAtom } from 'jotai';

import { InitialUserData } from './useCreateAccount';

import { db, storage, auth } from '@/main';
import { authUserAtom } from '@/store';
import { isValidEmail } from '@/utils';

export const useEditProfile = () => {
  const [authUser] = useAtom(authUserAtom);
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [myIconUrl, setMyIconUrl] = useState('');
  const [userIconFile, setUserIconFile] = useState<Blob>();
  const [password, setPassword] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [isPasswordComplete, setIsPasswordComplete] = useState(false);

  const isComplete = () => {
    if (!userName) return false;
    if (!isValidEmail(email)) return false;

    return true;
  };

  const userId = authUser?.uid || '';

  /**
   * メールアドレスを変更する際、パスワードで再認証を行う。
   */
  const reAuthenticate = async () => {
    if (!auth.currentUser?.email) return;
    const userEmail = auth.currentUser.email;

    const credential = EmailAuthProvider.credential(userEmail, password);
    await reauthenticateWithCredential(auth.currentUser, credential);
  };

  /**
   * storageにアバターを保存し、URLを取得する。
   */
  const uploadIcon = async (userIconFile: Blob, userId: string) => {
    if (!userIconFile) throw new Error('画像をアップロードしてください。');

    const storageRef = ref(storage, `iconImage/${userId}/userIcon`);
    await uploadBytes(storageRef, userIconFile);
    const url = await getDownloadURL(storageRef);

    return url;
  };

  /**
   * 変更されたユーザー情報をfirestoreに保存する。
   */
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
    await updateDoc(docRef, updateData);
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
    setPassword,
    passwordErrorMessage,
    password,
    userId,
    isPasswordComplete,
    setIsPasswordComplete,
  };
};
