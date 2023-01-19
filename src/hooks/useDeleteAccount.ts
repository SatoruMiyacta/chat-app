import { useState } from 'react';

import { isValidPassword } from '@/utils';

export const useDeleteAccount = () => {
  const [password, setPassword] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const isComplete = () => {
    if (!isValidPassword(password)) return false;

    return true;
  };

  return {
    setPasswordErrorMessage,
    passwordErrorMessage,
    setPassword,
    password,
    isComplete,
  };
};
