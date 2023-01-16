import { validateEmail } from '@/utils';
import { useState } from 'react';

export const useContact = () => {
  const [userName, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contactText, setContactText] = useState('');

  const isComplete = () => {
    if (!userName) return false;
    if (!validateEmail(email)) return false;
    if (!contactText) return false;

    return true;
  };

  return {
    userName,
    setName,
    email,
    setEmail,
    contactText,
    setContactText,
    isComplete,
  };
};
