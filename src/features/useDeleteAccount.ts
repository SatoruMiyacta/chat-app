import { useState } from 'react';

import { EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';

import { auth } from '@/main';
import { isValidPassword } from '@/utils';

export const useDeleteAccount = () => {
  const [password, setPassword] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const isComplete = () => {
    if (!isValidPassword(password)) return false;

    return true;
  };

  const reAuthenticate = async () => {
    if (!auth.currentUser?.email) return;
    const userEmail = auth.currentUser.email;

    const credential = EmailAuthProvider.credential(userEmail, password);
    await reauthenticateWithCredential(auth.currentUser, credential);
  };

  return {
    reAuthenticate,
    setPasswordErrorMessage,
    passwordErrorMessage,
    setPassword,
    password,
    isComplete,
  };
};
