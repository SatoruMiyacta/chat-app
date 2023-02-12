import { useState } from 'react';

import { isValidEmail } from '@/utils';

export const useResetPassword = () => {
  const [email, setEmail] = useState('');

  const isComplete = () => {
    if (!isValidEmail(email)) return false;

    return true;
  };

  return { email, setEmail, isComplete };
};
