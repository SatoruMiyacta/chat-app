import { useState, useRef } from 'react';

import { User } from 'firebase/auth';
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
  DocumentData,
  QueryDocumentSnapshot,
  QueryConstraint,
  where,
  documentId,
} from 'firebase/firestore';
import { useAtom } from 'jotai';

import { useTalkRoom } from '@/hooks';
import { db } from '@/main';
import { authUserAtom, messagesListAtom, MessageData } from '@/store';
import { isCacheActive } from '@/utils';

export interface MessageDataObject {
  [messageId: string]: MessageData;
}

export const useMessage = () => {
  const [messageDataObject, setMessageDataobject] =
    useState<MessageDataObject>();
  const [authUser] = useAtom(authUserAtom);
  const [messagesList] = useAtom(messagesListAtom);
  const [messageIdList, setMessageIdList] = useState<string[]>([]);

  const [lastMessage, setLastMessge] =
    useState<QueryDocumentSnapshot<DocumentData> | null>();
  const { saveMessage } = useTalkRoom();

  const userRef = useRef<User>();
  const lastMessageRef = useRef<QueryDocumentSnapshot<DocumentData> | null>();
  const messageIdListRef = useRef<string[]>();

  if (authUser) userRef.current = authUser;
  if (lastMessageRef) lastMessageRef.current = lastMessage;
  if (messageIdList) messageIdListRef.current = messageIdList;

  const getMessageIdList = async (roomId: string, isUsedCache: boolean) => {
    // この関数はaddEventlistener内で呼ばれるため、
    // 最新のstateを参照するべくrefから取得する
    const lastUnderMessage = lastMessageRef.current;
    const messageNewIdList = messageIdListRef.current;

    if (isUsedCache && messagesList && isCacheActive(messagesList)) {
      const messageCacheIdList = messagesList?.data as string[];
      setMessageIdList(messageCacheIdList);

      return messageCacheIdList;
    }

    if (!roomId) throw new Error('トークがありません。');

    const roomRef = collection(db, 'rooms', roomId, 'messages');
    const queryArray: QueryConstraint[] = [
      orderBy('createdAt', 'desc'),
      limit(10),
    ];

    if (lastUnderMessage) {
      queryArray.push(startAfter(lastUnderMessage));
    }

    const querySnapshots = await getDocs(query(roomRef, ...queryArray));
    const lastVisible = querySnapshots.docs[querySnapshots.docs.length - 1];

    if (lastVisible) setLastMessge(lastVisible);

    const list: string[] = [];
    for (const doc of querySnapshots.docs) {
      const roomId = doc.id;
      list.push(roomId);
    }

    const reverseList = list.reverse();

    if (messageNewIdList) {
      setMessageIdList((prev) => {
        return Array.from(new Set([...reverseList, ...prev]));
      });
    }

    return reverseList;
  };

  /**
   * 取得したmessageIdListでメッセージデータを保存
   * メッセージを送ったユーザー一覧を返す
   */
  const saveMessageData = async (roomId: string, messageIdList: string[]) => {
    const userRef = collection(db, 'rooms', roomId, 'messages');
    const querySnapshots = await getDocs(
      query(userRef, where(documentId(), 'in', messageIdList))
    );
    const postUserIdList = [];
    const messageDataObject: MessageDataObject = {};
    for (const doc of querySnapshots.docs) {
      const data = doc.data();
      const id = doc.id;

      const messageData = {
        postUserId: data.postUserId,
        message: data.message,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      };

      postUserIdList.push(data.postUserId);
      messageDataObject[id] = messageData;
      saveMessage(id, messageData);
    }

    setMessageDataobject((prev) => ({ ...prev, ...messageDataObject }));
    return postUserIdList;
  };

  // 日付を0/00 00:00 で表示
  const setMessageDate = (id: string) => {
    if (!messageDataObject) return;

    const month = `${messageDataObject[id].createdAt.getMonth() + 1}`.padStart(
      2,
      '0'
    );
    const date = `${messageDataObject[id].createdAt.getDate()}`.padStart(
      2,
      '0'
    );
    const hours = `${messageDataObject[id].createdAt.getHours()}`.padStart(
      2,
      '0'
    );
    const minutes = `${messageDataObject[id].createdAt.getMinutes()}`.padStart(
      2,
      '0'
    );

    return `${month}/${date} ${hours}:${minutes}`;
  };

  return {
    saveMessageData,
    getMessageIdList,
    setMessageIdList,
    messageIdList,
    messagesList,
    messageDataObject,
    saveMessage,
    setMessageDataobject,
    setLastMessge,
    lastMessage,
    setMessageDate,
    messageIdListRef,
  };
};
