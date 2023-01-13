import { useState } from 'react';

export const useDeleteAccount = () => {
  const [password, setPassword] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const isComplete = () => {
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
  return {
    passwordComplete,
    setPasswordErrorMessage,
    passwordErrorMessage,
    setPassword,
    password,
    isComplete,
  };
};
