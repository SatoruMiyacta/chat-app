import { useState } from 'react';

export const useResetPassword = () => {
  const [email, setEmail] = useState('');
  const isComplete = () => {
    if (!email) return false;

    const emailRegex = new RegExp(
      '^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]+.[A-Za-z0-9]+$'
    );
    if (!emailRegex.test(email)) return false;

    return true;
  };

  return { email, setEmail, isComplete };
};
