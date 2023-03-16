import { useState } from 'react';

import { isValidEmail } from '@/utils';

export const useContact = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [contactText, setContactText] = useState('');

  const isComplete = () => {
    if (!userName) return false;
    if (!isValidEmail(email)) return false;
    if (!contactText) return false;

    return true;
  };

  return {
    userName,
    setUserName,
    email,
    setEmail,
    contactText,
    setContactText,
    isComplete,
  };
};
