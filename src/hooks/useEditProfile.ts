import { useState } from 'react';

import loadImage from 'blueimp-load-image';
import { doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

import { db, storage } from '@/main';

export const useEditProfile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [nameErrorMessage, setNameErrorMessage] = useState('');
  const [myIconUrl, setMyIconUrl] = useState('');
  const [userIconFile, setUserIconFile] = useState<Blob>();

  const isComplete = () => {
    if (!name) return false;
    if (!email) return false;

    // const nameRegex = new RegExp('[^\x01-/:-@[-`{-~]+');
    // if (!nameRegex.test(name)) return false;

    return true;
  };

  const nameComplete = () => {
    // const nameRegex = new RegExp('[^\x01-/:-@[-`{-~]+');
    // if (!nameRegex.test(name)) {
    //   return '半角英数字か全角で入力してください';
    // }
    // return '';
  };

  const getMyUserData = async (userId: string) => {
    const docRef = doc(db, 'users', `${userId}`);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();
    if (!data) return;

    setMyIconUrl(data.iconURL);
    setName(data.name);
    setEmail(data.email);
  };

  const saveUserData = async (
    userId: string,
    userIconUrl: string,
    name: string,
    email: string
  ) => {
    const docRef = doc(db, 'users', userId);
    await updateDoc(docRef, {
      name: name,
      iconUrl: userIconUrl,
      updateAt: serverTimestamp(),
    });
  };

  const onFileload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const file = event.target.files[0];

    const loadImageResult = await loadImage(file, {
      maxWidth: 500,
      maxHeight: 500,
      canvas: true,
    });
    const canvas = loadImageResult.image as HTMLCanvasElement;
    canvas.toBlob(async (blob) => {
      if (!blob)
        throw new Error(
          '画像読み込みに失敗しました。再度アップロードしてください。'
        );

      // 画像容量制限
      // 単位byte
      const maxFileSize = 10000000;
      if (blob.size > maxFileSize) {
        throw new Error('画像サイズは１０MB以下にしてください');
      }

      setUserIconFile(blob);
      setMyIconUrl(URL.createObjectURL(blob));
    });
  };

  const uploadIcon = async (userIconFile: Blob, userId: string) => {
    if (!userIconFile) throw new Error('画像をアップロードしてください。');

    const storageRef = ref(storage, `iconImage/${userId}/userIcon`);
    const snapshot = await uploadBytes(storageRef, userIconFile);
    const url = await getDownloadURL(storageRef);

    return url;
  };

  return {
    onFileload,
    saveUserData,
    getMyUserData,
    uploadIcon,
    userIconFile,
    myIconUrl,
    name,
    setName,
    email,
    setEmail,
    nameErrorMessage,
    isComplete,
    nameComplete,
    setNameErrorMessage,
  };
};
