import { useState } from 'react';

import {
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import { useAtom } from 'jotai';

import { db } from '@/main';
import { authUserAtom, usersAtom } from '@/store';
import { getCacheExpirationDate, fetchUserData, isCacheActive } from '@/utils';

export const useHome = () => {
  const [users, setUsers] = useAtom(usersAtom);
  const fetchfriendsData = async (userId: string) => {
    const querySnapshot = await getDocs(
      collection(db, 'users', userId, 'friends')
    );
    return querySnapshot;
  };

  const fetchGloupsData = async (userId: string) => {
    const querySnapshot = await getDocs(
      collection(db, 'users', userId, 'groups')
    );

    return querySnapshot;
  };

  return { fetchfriendsData, fetchGloupsData };
};
