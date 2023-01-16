import { useState } from 'react';

import { validateEmail } from '@/utils';

export const useResetPassword = () => {
  const [email, setEmail] = useState('');

  const isComplete = () => {
    if (!validateEmail(email)) return false;

    return true;
  };

  return { email, setEmail, isComplete };
};
