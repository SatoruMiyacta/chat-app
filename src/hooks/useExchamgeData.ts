import { useAtom } from 'jotai';

import { authUserAtom, usersAtom, UserData } from '@/store';
import { getCacheExpirationDate, fetchUserData, isCacheActive } from '@/utils';

export const useExchangeData = () => {
  const [users, setUsers] = useAtom(usersAtom);
  const [authUser] = useAtom(authUserAtom);

  const userId = authUser?.uid || '';

  const getUserData = async (userId: string) => {
    if (isCacheActive(users[userId])) return users[userId].data;

    const userData = await fetchUserData(userId);
    if (!userData) return;

    return userData;
  };

  const updateCacheUserData = (userId: string, userData: UserData) => {
    setUsers((prevState) => ({
      ...prevState,
      [userId]: { data: userData, expiresIn: getCacheExpirationDate() },
    }));
  };

  return { getUserData, userId, updateCacheUserData };
};
