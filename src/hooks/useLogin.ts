import { useState } from 'react';

import { signInWithEmailAndPassword } from 'firebase/auth';

import { auth } from '@/main';

export const useLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const isComplete = () => {
    if (!email) return false;
    if (!password) return false;

    const passWordRegex = new RegExp('^[0-9a-zA-Z]*$');
    if (!passWordRegex.test(password)) {
      return false;
    }

    return true;
  };

  const passwordComplete = () => {
    const passWordRegex = new RegExp('^[0-9a-zA-Z]*$');
    if (!passWordRegex.test(password)) {
      return '半角英数字で入力してください';
    }
    return '';
  };

  const signIn = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    return userCredential.user;
  };

  return {
    signIn,
    email,
    setEmail,
    password,
    setPassword,
    passwordErrorMessage,
    passwordComplete,
    setPasswordErrorMessage,
    isComplete,
  };
};
