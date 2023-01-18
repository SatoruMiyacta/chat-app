import { useState } from 'react';

import { validateEmail } from '@/utils';

export const useEditProfile = () => {
  const [userName, setName] = useState('');
  const [email, setEmail] = useState('');
  const [myIconUrl, setMyIconUrl] = useState('');
  const [userIconFile, setUserIconFile] = useState<Blob>();

  const isComplete = () => {
    if (!userName) return false;
    if (!validateEmail(email)) return false;

    return true;
  };

  return {
    userIconFile,
    myIconUrl,
    userName,
    setName,
    email,
    setEmail,
    isComplete,
  };
};
