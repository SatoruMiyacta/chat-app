import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { FirebaseError } from 'firebase/app';
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
} from 'firebase/firestore';
import { useAtom } from 'jotai';

import styles from './MessageForm.module.css';

import { faCamera, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Heading';
import Input from '@/components/atoms/Input';
import Modal from '@/components/molecules/Modal';
import Avatar from '@/components/organisms/Avatar';

import {
  useMessage,
  MessageDataObject,
  JoinedRoomsDataObject,
  useBlock,
} from '@/features';
import {
  useTalkRoom,
  useUser,
  UserDataObject,
  UserAndGroupId,
  useGroup,
  useFriend,
} from '@/hooks';
import { db } from '@/main';
import {
  authUserAtom,
  joinedRoomListAtom,
  friendsIdAtom,
  blockUserIdAtom,
  joinedGroupsAtom,
} from '@/store';
import {
  addMyRoomMessage,
  existUnAuthRoom,
  setUsersBlockUser,
  deleteUnAuthRoom,
  setUsersJoinedRooms,
  deleteGroupMember,
  getUnAuthRoom,
  updateLastReadAt,
  setMyJoinedGroups,
  searchMyJoinedRoom,
  getJoinedRoomData,
  updateJoinedRoomsUpdatedAt,
  getFirebaseError,
  setFriend,
} from '@/utils';

export interface MessageProps {
  postId: string;
}

const MessageForm = ({ postId }: MessageProps) => {
  const [authUser] = useAtom(authUserAtom);
  const [sendingMessge, setSendingMessage] = useState('');
  const [friends] = useAtom(friendsIdAtom);
  const [joinedGroups] = useAtom(joinedGroupsAtom);
  const [userDataObject, setUserDataobject] = useState<UserDataObject>();
  const [isUnAuthRoom, setIsUnAuthRoom] = useState(false);
  const scrollBottomRef = useRef<HTMLLIElement>(null);
  const [joinedRoomsList] = useAtom(joinedRoomListAtom);
  const [blockUser] = useAtom(blockUserIdAtom);
  const [errorMessage, setErrorMessage] = useState(
    '予期せぬエラーが発生しました。お手数ですが、再度ログインしてください。'
  );
  const [isOpenErrorModal, setIsOpenErrorModal] = useState(false);
  const navigate = useNavigate();

  const {
    saveMessageData,
    getMessageIdList,
    setMessageIdList,
    messageIdList,
    messageDataObject,
    saveMessage,
    setMessageDataobject,
    setLastMessge,
    setMessageDate,
  } = useMessage();
  const { saveBlockUserIdList } = useBlock();

  const { saveGroupsMemberIdList, getGroupsMember, saveJoinedGroups } =
    useGroup();

  const { saveUserData } = useUser();
  const { saveJoinedRoomsList } = useTalkRoom();
  const { saveFriendIdList } = useFriend();
  const scrollRef = useRef<HTMLDivElement>(null);

  const userId = authUser?.uid;

  const onBlockUser = async () => {
    if (!userId) return;
    if (!postId) return;

    const data = await getUnAuthRoom(userId, postId);

    if (!data) return;

    const type = data.type;
    const anotherId = data.id;
    const isVisible = false;

    const joinedRoomsDataObject: JoinedRoomsDataObject = {
      anotherId,
      type,
      isVisible,
    };

    if (type === 'user') {
      await setUsersBlockUser(userId, anotherId);

      await setUsersJoinedRooms(userId, postId, joinedRoomsDataObject);

      await deleteUnAuthRoom(userId, postId);

      const blockUserIdListCache = blockUser?.data as string[];
      if (blockUserIdListCache) blockUserIdListCache.push(anotherId);

      saveBlockUserIdList(blockUserIdListCache);

      const roomList = joinedRoomsList?.data as string[];

      const newJoinedRoomsList = [...roomList];
      const index = newJoinedRoomsList.indexOf(anotherId);
      newJoinedRoomsList.splice(index, 1);

      saveJoinedRoomsList(newJoinedRoomsList);
    } else {
      await deleteUnAuthRoom(userId, postId);
      await deleteGroupMember(anotherId, userId);
    }
    navigate(`/rooms`);
  };

  const onAuthenticateRoom = async () => {
    if (!userId) return;
    if (!postId) return;

    try {
      const data = await getUnAuthRoom(userId, postId);
      if (!data) return;

      const type = data.type;
      const anotherId = data.id;
      const isVisible = true;
      const joinedRoomsDataObject: JoinedRoomsDataObject = {
        anotherId,
        type,
        isVisible,
      };

      const groupId = postId;
      const userAndGroupId: UserAndGroupId = { userId, groupId };

      if (type === 'user') {
        await setUsersJoinedRooms(userId, postId, joinedRoomsDataObject);
        await deleteUnAuthRoom(userId, postId);

        if (friends && typeof friends !== 'undefined') {
          const friendsCacheList = friends.data as string[];
          friendsCacheList.unshift(anotherId);
          saveFriendIdList(friendsCacheList);
        }

        await setFriend(userId, anotherId);
      } else {
        await setUsersJoinedRooms(userId, postId, joinedRoomsDataObject);
        await setMyJoinedGroups(userAndGroupId);
        await deleteUnAuthRoom(userId, postId);

        if (joinedGroups && typeof joinedGroups !== 'undefined') {
          const joinedGroupsCacheList = [...(joinedGroups.data as string[])];
          joinedGroupsCacheList.unshift(postId);
          saveJoinedGroups(joinedGroupsCacheList);
        }

        await setMyJoinedGroups(userAndGroupId);
      }
      if (joinedRoomsList && typeof joinedRoomsList !== 'undefined') {
        const joinedRoomsCacheList = joinedRoomsList.data as string[];
        joinedRoomsCacheList.unshift(postId);
        saveJoinedRoomsList(joinedRoomsCacheList);
      }

      navigate(`/rooms`);
    } catch (error) {
      console.error(error);
    }
  };

  const sendMessage = async () => {
    if (sendingMessge === '') return;
    if (!userId) return;
    if (!postId) return;

    await addMyRoomMessage(userId, postId, sendingMessge);

    const data = await getJoinedRoomData(userId, postId);

    if (!data) return;

    const roomType = data.type;
    const roomTypeId = data.id;

    if (roomType === 'user') {
      const querySnapshot = await existUnAuthRoom(roomTypeId, postId);

      if (querySnapshot.docs.length === 0) {
        await updateJoinedRoomsUpdatedAt(roomTypeId, postId);
      }
    } else if (roomType === 'group') {
      const memberIdList = await getGroupsMember(roomTypeId);

      for (const memberId of memberIdList) {
        const querySnapshot = await existUnAuthRoom(memberId, postId);
        if (!querySnapshot.docs) {
          await updateJoinedRoomsUpdatedAt(memberId, postId);
        }
      }
      saveGroupsMemberIdList(postId, memberIdList);
    }
    setSendingMessage('');
  };

  const getMessage = async (isUsedCache: boolean) => {
    if (!postId) return;

    if (location.pathname !== `/rooms/${postId}/message`) return;

    const messageIdList = await getMessageIdList(postId, isUsedCache);

    if (messageIdList.length === 0) return;

    const postUserIdList = await saveMessageData(postId, messageIdList);

    const userData = await saveUserData(postUserIdList);

    if (userData) {
      setUserDataobject((prev) => ({
        ...prev,
        ...userData,
      }));
    }

    return messageIdList;
  };

  const checkAuthRoom = async (userId: string, roomId: string) => {
    const querySnapshot = await existUnAuthRoom(userId, roomId);

    if (querySnapshot.docs.length === 0) {
      await getMessage(true);
    } else {
      setIsUnAuthRoom(true);
    }
  };

  useEffect(() => {
    try {
      if (!postId) return;
      if (!userId) return;

      setIsUnAuthRoom(false);
      setMessageIdList([]);
      setLastMessge(null);
      checkAuthRoom(userId, postId);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else if (error instanceof FirebaseError) {
        const errorCode = error.code;
        setErrorMessage(getFirebaseError(errorCode));
      }

      setIsOpenErrorModal(true);
    }
  }, [postId, userId]);

  useEffect(() => {
    if (!postId) return;

    const querySnapshot = collection(db, 'rooms', postId, 'messages');
    const unsubscribe = onSnapshot(
      query(querySnapshot, orderBy('createdAt', 'desc'), limit(1)),
      (snapshot) => {
        const newMessageIdList: string[] = [];
        const postUserIdList: string[] = [];
        const messageDataObject: MessageDataObject = {};
        for (const doc of snapshot.docs) {
          const messageId = doc.id;
          newMessageIdList.push(messageId);

          const data = doc.data();

          if (data.createdAt) {
            const messageData = {
              postUserId: data.postUserId,
              message: data.message,
              createdAt: data.createdAt.toDate(),
              updatedAt: data.updatedAt.toDate(),
            };

            postUserIdList.push(data.postUserId);
            messageDataObject[messageId] = messageData;
            saveMessage(messageId, messageData);

            if (userId) {
              // lastReadAt更新前に自分のjoinedRooms に該当のルームがあるか確認
              searchMyJoinedRoom(userId, postId).then((querySnapshot) => {
                if (querySnapshot?.docs.length !== 0) {
                  updateLastReadAt(userId, postId);
                }
              });
            }
          }

          setLastMessge(doc);

          setMessageDataobject((prev) => ({ ...prev, ...messageDataObject }));
        }

        if (postUserIdList.length !== 0) {
          saveUserData(postUserIdList).then((userDataObject) => {
            setUserDataobject((prev) => ({
              ...prev,
              ...userDataObject,
            }));
          });
        }

        setMessageIdList((prev) => {
          return Array.from(new Set([...prev, ...newMessageIdList]));
        });
      }
    );

    return () => {
      unsubscribe();
    };
  }, [postId]);

  const scrollRefCurrent = scrollRef.current;

  useEffect(() => {
    if (messageIdList.length === 10) {
      setTimeout(() => {
        scrollBottomRef.current?.scrollIntoView(false);
      }, 700);
    } else if (
      scrollRefCurrent &&
      scrollRefCurrent?.scrollHeight ===
        scrollRefCurrent?.clientHeight + scrollRefCurrent?.scrollTop + 17
    ) {
      setTimeout(() => {
        scrollBottomRef.current?.scrollIntoView(false);
      }, 500);
    }
  }, [messageIdList.length]);

  const isPcWindow = window.matchMedia('(min-width:1024px)').matches;
  const handleScroll = async () => {
    if (!scrollRefCurrent) return;
    if (scrollRefCurrent.scrollTop !== 0) return;

    const messageList = await getMessage(false);

    // スクロールしたときに上から300px下にスクロールバーをずらす
    if (messageList && messageList.length !== 0) {
      scrollRef.current.scrollBy(0, 300);
    }
  };

  useEffect(() => {
    scrollRefCurrent?.addEventListener('scroll', handleScroll);

    return () => {
      scrollRefCurrent?.removeEventListener('scroll', handleScroll);
    };
  }, [scrollRefCurrent]);

  const renderErrorModal = () => {
    if (!isOpenErrorModal) return;

    return (
      <Modal
        onClose={() => setIsOpenErrorModal(false)}
        title="エラー"
        titleAlign="center"
        hasInner
        isOpen={isOpenErrorModal}
        isBoldTitle
      >
        <div>
          <p>{errorMessage}</p>
        </div>
        <div className={styles.controler}>
          <Button
            color="primary"
            onClick={() => setIsOpenErrorModal(false)}
            variant="contained"
            isFullWidth
            size="small"
          >
            OK
          </Button>
        </div>
      </Modal>
    );
  };

  const showMessageList = () => {
    if (typeof userDataObject === 'undefined') return;
    if (typeof messageDataObject === 'undefined') return;

    return (
      <div ref={scrollRef} className={styles.list}>
        <ul>
          {messageIdList.map((id, index) => (
            <li key={`message-list-${id}-${index}`} className="inner">
              {messageDataObject[id] && (
                <>
                  <div className={`${styles.oneline} flex alic`}>
                    <div className="flex alic">
                      <Avatar
                        iconUrl={
                          userDataObject[messageDataObject[id].postUserId]
                            ?.iconUrl
                        }
                        uploadIconSize="xs"
                        isNotUpload
                      />
                      <Heading tag="h1" color="inherit" size="s">
                        {userDataObject[messageDataObject[id].postUserId]?.name}
                      </Heading>
                    </div>
                    <div className="flex alic">
                      <span>{setMessageDate(id)}</span>
                    </div>
                  </div>
                  <div className={styles.message}>
                    <p>{messageDataObject[id]?.message}</p>
                  </div>
                </>
              )}
            </li>
          ))}
          <li ref={scrollBottomRef}></li>
        </ul>
      </div>
    );
  };

  return (
    <>
      {renderErrorModal()}
      {isUnAuthRoom && (
        <div className={`${styles.authArea} `}>
          <div>
            <button onClick={onBlockUser}>ブロック</button>
            <button onClick={onAuthenticateRoom}>承認</button>
          </div>
          <div className="inner">
            <p className="">
              未承認のトークルームです。トークを継続する場合は承認ボタンを押してください。
            </p>
          </div>
        </div>
      )}
      {!isUnAuthRoom && !isPcWindow && (
        <div className={styles.container}>
          {showMessageList()}
          <div className={`${styles.messageContents} flex alic`}>
            <button>
              <FontAwesomeIcon icon={faCamera} size="lg" />
            </button>
            <Input
              color="primary"
              id="contact"
              onChange={(event) => setSendingMessage(event.target.value)}
              type="text"
              variant="outlined"
              value={sendingMessge}
              isFullWidth
              isMultiLines
              isRounded
              maxRows={2}
              maxLength={1000}
              size="small"
            />
            <button onClick={sendMessage}>
              <FontAwesomeIcon icon={faPaperPlane} size="lg" />
            </button>
          </div>
        </div>
      )}
      {!isUnAuthRoom && isPcWindow && (
        <>
          <div className={styles.container}>
            {showMessageList()}
            <div className={`${styles.messageContents}`}>
              <span className="inner flex">
                <button>
                  <FontAwesomeIcon icon={faCamera} size="lg" />
                </button>
                <button onClick={sendMessage}>
                  <FontAwesomeIcon icon={faPaperPlane} size="lg" />
                </button>
              </span>
              <Input
                color="primary"
                id="contact"
                onChange={(event) => setSendingMessage(event.target.value)}
                type="text"
                variant="outlined"
                value={sendingMessge}
                isFullWidth
                isMultiLines
                placeholder="メッセージを入力"
                maxRows={13}
                minRows={2}
                maxLength={1000}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};
export default MessageForm;
