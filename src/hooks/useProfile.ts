import { doc, getDoc } from 'firebase/firestore';

import { db } from '@/main';

export const useProfile = () => {
  const fetchUserData = async (userId: string) => {
    const docRef = doc(db, 'users', `${userId}`);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();

    return data;
  };

  return { fetchUserData };
};
