import { useState } from 'react';

import { signInWithEmailAndPassword } from 'firebase/auth';

import { auth } from '@/main';
import { isValidPassword, validateEmail } from '@/utils';

export const useLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');

  const isComplete = () => {
    if (!validateEmail(email)) return false;
    if (!isValidPassword(password)) return false;

    return true;
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
    // validatePassword,
    setPasswordErrorMessage,
    isComplete,
  };
};
