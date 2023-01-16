import { validateEmail } from '@/utils';
import { useState } from 'react';

export const useResetPassword = () => {
  const [email, setEmail] = useState('');

  const isComplete = () => {
    if (!validateEmail(email)) return false;

    return true;
  };

  return { email, setEmail, isComplete };
};
