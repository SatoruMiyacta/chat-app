import {
  collection,
  doc,
  getDoc,
  addDoc,
  getDocs,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { useAtom } from 'jotai';

import { db } from '@/main';
import { authUserAtom, usersAtom, UserData, RoomData } from '@/store';

export const useMessage = () => {
  const [users, setUsers] = useAtom(usersAtom);
  const [authUser] = useAtom(authUserAtom);

  const userId = authUser?.uid;

  return {};
};
