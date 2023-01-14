import { useState } from 'react';

import loadImage from 'blueimp-load-image';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

import { INITIAL_ICON_URL } from '@/constants';
import { auth, db, storage } from '@/main';

export interface InitialUserData {
  name: string;
  userIconUrl: string;
}
export const useCreateAccounts = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nameErrorMessage, setNameErrorMessage] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [userIconFile, setUserIconFile] = useState<Blob>();
  // プレビューのiconURL
  const [initialIconUrl, setInitialIconUrl] = useState(INITIAL_ICON_URL);

  const isComplete = () => {
    if (!name) return false;
    if (!email) return false;
    if (!password) return false;

    const nameRegex = new RegExp('[^\x01-/:-@[-`{-~]+');
    if (!nameRegex.test(name)) return false;

    const passWordRegex = new RegExp('^[0-9a-zA-Z]*$');
    if (!passWordRegex.test(password)) {
      return false;
    }
    return true;
  };

  const nameComplete = () => {
    const nameRegex = new RegExp('[^\x01-/:-@[-`{-~]+');
    if (!nameRegex.test(name)) {
      return '半角英数字か日本語で入力してください';
    }
    return '';
  };

  const passwordComplete = () => {
    const passWordRegex = new RegExp('^[0-9a-zA-Z]*$');
    if (!passWordRegex.test(password)) {
      return '半角英数字で入力してください';
    }
    return '';
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
    { name, userIconUrl }: InitialUserData
  ) => {
    const docRef = doc(db, 'users', useId);
    await setDoc(docRef, {
      name: name,
      iconURL: userIconUrl,
      createdAt: serverTimestamp(),
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
      setInitialIconUrl(URL.createObjectURL(blob));
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
    registerUserDate,
    initialIconUrl,
    signUp,
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    passwordErrorMessage,
    setPasswordErrorMessage,
    nameErrorMessage,
    setNameErrorMessage,
    nameComplete,
    passwordComplete,
    isComplete,
    onFileload,
    uploadIcon,
    userIconFile,
    setInitialIconUrl,
  };
};
