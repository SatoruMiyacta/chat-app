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
import { authUserAtom, usersAtom, UserData } from '@/store';
import { getCacheExpirationDate, fetchUserData, isCacheActive } from '@/utils';

export const useMessage = () => {
  const [users, setUsers] = useAtom(usersAtom);
  const [authUser] = useAtom(authUserAtom);

  const userId = authUser?.uid;

  /**
   *トークルームのメッセージを取得。
   */
  const fetchMessages = async (roomId: string) => {
    const querySnapshot = await getDocs(
      collection(db, 'rooms', roomId, 'messages')
    );
    return querySnapshot;
  };

  const addMessage = async (roomId: string, message: string) => {
    const doc = collection(db, 'rooms', roomId, 'messages');
    if (!userId) return;
    const querySnapshot = await addDoc(doc, {
      postUserId: userId,
      message: message,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return querySnapshot;
  };

  return { fetchMessages, addMessage };
};
