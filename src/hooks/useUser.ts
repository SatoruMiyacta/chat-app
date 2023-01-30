import { useAtom } from 'jotai';

import { authUserAtom, usersAtom, UserData } from '@/store';
import { getCacheExpirationDate, fetchUserData, isCacheActive } from '@/utils';

export const useUser = () => {
  const [users, setUsers] = useAtom(usersAtom);
  const [authUser] = useAtom(authUserAtom);

  const getUser = async (userId: string) => {
    if (isCacheActive(users[userId])) return users[userId].data;

    const userData = await fetchUserData(userId);
    if (!userData) return;

    return userData;
  };

  const saveUser = (userId: string, userData: UserData) => {
    setUsers((prevState) => ({
      ...prevState,
      [userId]: { data: userData, expiresIn: getCacheExpirationDate() },
    }));
  };

  return { getUser, saveUser };
};
