import { useState } from 'react';

import { doc, getDoc } from 'firebase/firestore';
import { useAtom } from 'jotai';

import { db } from '@/main';
import { authUserAtom } from '@/store/user';

export const useProfile = () => {
  const [authUser, setAuthUser] = useAtom(authUserAtom);
  const [userName, setUserName] = useState('');
  const [myIconUrl, setMyIconUrl] = useState('');

  const fetchUserData = async (userId: string) => {
    const docRef = doc(db, 'users', `${userId}`);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();

    return data;
  };

  return { fetchUserData, myIconUrl, userName };
};
