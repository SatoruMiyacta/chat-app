import { useEffect, useState, useRef } from 'react';

import { FirebaseError } from 'firebase/app';
import {
  collection,
  query,
  orderBy,
  limit,
  where,
  onSnapshot,
  getCountFromServer,
} from 'firebase/firestore';
import { useAtom } from 'jotai';

import styles from './RoomOverview.module.css';

import Button from '@/components/atoms/Button';
import Skeleton from '@/components/atoms/Skeleton';
import Modal from '@/components/molecules/Modal';
import AvatarList from '@/components/organisms/AvatarList';

import { useRoom, JoinedRoomsObject } from '@/features';
import { useUser, useGroup, useTalkRoom } from '@/hooks';
import { db } from '@/main';
import { authUserAtom } from '@/store';
import { getFirebaseError, getUnAuthRoomData } from '@/utils';

export interface UnReadCount {
  [roomId: string]: number;
}

const RoomOverview = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [authUser] = useAtom(authUserAtom);
  const [errorMessage, setErrorMessage] = useState(
    '予期せぬエラーが発生しました。お手数ですが、再度ログインしてください。'
  );
  const [isOpenErrorModal, setIsOpenErrorModal] = useState(false);
  const [joinedRooms, setJoinedRooms] = useState<JoinedRoomsObject>();
  const [unReadCount, setUnReadCount] = useState<UnReadCount>();
  const {
    getMyRoomIdList,
    saveRoomData,
    setMyRoomList,
    getJoinedRoomData,
    myRoomList,
    setLastRoom,
    myRoomListRef,
  } = useRoom();
  const { saveJoinedRooms, saveJoinedRoomsList } = useTalkRoom();

  const { saveUserData } = useUser();

  const { saveGroupData } = useGroup();
  const scrollRef = useRef<HTMLDivElement>(null);

  const userId = authUser?.uid || '';

  const countUnReadMessage = async (
    joinedRoomsObject: JoinedRoomsObject,
    roomIdList: string[]
  ) => {
    for (const roomId of roomIdList) {
      if (typeof joinedRoomsObject === 'undefined') return;
      if (typeof joinedRoomsObject[roomId] === 'undefined') return;

      const date = joinedRoomsObject[roomId].lastReadAt;

      date.setSeconds(date.getSeconds() + 0.3);

      const collectionRef = collection(db, 'rooms', roomId, 'messages');
      const query_ = query(collectionRef, where('createdAt', '>', date));
      const snapshot = await getCountFromServer(query_);
      const count = snapshot.data().count;

      setUnReadCount((prev) => ({
        ...prev,
        [roomId]: count,
      }));
    }
  };

  const getUserAndGroupData = async (roomIdList: string[]) => {
    const joinedRoomsObject = await getJoinedRoomData(userId, roomIdList);
    if (typeof joinedRoomsObject === 'undefined') return;

    const userList: string[] = [];
    const groupList: string[] = [];
    for (const roomId of roomIdList) {
      const roomType = joinedRoomsObject[roomId].type;
      const roomTypeId = joinedRoomsObject[roomId].id;

      if (roomType === 'user') {
        userList.push(roomTypeId);
      } else if (roomType === 'group') {
        groupList.push(roomTypeId);
      }
      saveJoinedRooms(roomId, joinedRoomsObject[roomId]);
    }

    if (userList.length !== 0) {
      const firstUserIdList = userList.slice(0, 10);
      await saveUserData(firstUserIdList);
      if (userList.length > 10) {
        const secondUserIdList = userList.slice(10);
        await saveUserData(secondUserIdList);
      }
    }

    if (groupList.length !== 0) {
      const firstGroupIdList = groupList.slice(0, 10);
      await saveGroupData(firstGroupIdList);
      if (groupList.length > 10) {
        const secondGroupIdList = groupList.slice(10);
        await saveGroupData(secondGroupIdList);
      }
    }

    await saveRoomData(roomIdList);

    await countUnReadMessage(joinedRoomsObject, roomIdList);

    return joinedRoomsObject;
  };

  useEffect(() => {
    if (!userId) return;

    const querySnapshot = collection(db, 'users', userId, 'joinedRooms');
    const unsubscribe = onSnapshot(
      query(
        querySnapshot,
        where('isVisible', '!=', false),
        orderBy('isVisible', 'desc'),
        orderBy('updatedAt', 'desc'),
        limit(1)
      ),
      (snapshot) => {
        const newRoomIdList: string[] = [];
        for (const doc of snapshot.docs) {
          const roomId = doc.id;
          newRoomIdList.push(roomId);

          setLastRoom(doc);
        }

        setMyRoomList((prev) => {
          return Array.from(new Set([...newRoomIdList, ...prev]));
        });

        getUserAndGroupData(newRoomIdList).then((joinedRoomsObject) => {
          setJoinedRooms((prev) => ({
            ...prev,
            ...joinedRoomsObject,
          }));
        });
      }
    );
    return () => unsubscribe();
    // }, [userId]);
  }, [myRoomList.length]);

  useEffect(() => {
    if (!userId) return;

    const querySnapshot = collection(db, 'users', userId, 'unAuthRoom');
    const unsubscribe = onSnapshot(
      query(querySnapshot, orderBy('createdAt', 'desc')),
      (snapshot) => {
        const newRoomList: string[] = [];
        for (const doc of snapshot.docs) {
          const roomId = doc.id;
          newRoomList.push(roomId);
        }
        if (newRoomList.length === 0) return;

        getUnAuthRoomData(userId, newRoomList).then((unAuthRoomsObject) => {
          const userList: string[] = [];
          const groupList: string[] = [];
          for (const roomId of newRoomList) {
            if (unAuthRoomsObject) {
              saveJoinedRooms(roomId, unAuthRoomsObject[roomId]);

              const roomTypeId = unAuthRoomsObject[roomId].id;
              const roomType = unAuthRoomsObject[roomId].type;

              if (roomType === 'user') {
                userList.push(roomTypeId);
              } else if (roomType === 'group') {
                groupList.push(roomTypeId);
              }
            }
          }

          if (userList.length !== 0) saveUserData(userList);

          if (groupList.length !== 0) saveGroupData(groupList);

          setJoinedRooms((prev) => ({
            ...prev,
            ...unAuthRoomsObject,
          }));

          setMyRoomList((prev) => {
            return Array.from(new Set([...newRoomList, ...prev]));
          });
        });
      }
    );
    return () => unsubscribe();
    // }, [userId]);
  }, [myRoomList.length]);

  const getRoomList = async (isUsedCache: boolean) => {
    const roomIdList = await getMyRoomIdList(isUsedCache);
    setMyRoomList(roomIdList);
    if (roomIdList.length === 0) return;

    const joinedRoomsObject = await getUserAndGroupData(roomIdList);
    setJoinedRooms((prev) => ({
      ...prev,
      ...joinedRoomsObject,
    }));

    return roomIdList;
  };

  useEffect(() => {
    try {
      if (!userId) return;

      myRoomListRef.current = [];
      setMyRoomList([]);
      setJoinedRooms({});
      getRoomList(true).then((roomIdList) => {
        if (roomIdList) {
          saveJoinedRoomsList(roomIdList);
          saveRoomData(roomIdList);
        }
      });

      setIsLoading(false);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else if (error instanceof FirebaseError) {
        const errorCode = error.code;
        setErrorMessage(getFirebaseError(errorCode));
      }

      setIsOpenErrorModal(true);
    }
  }, [userId]);

  const scrollRefCurrent = scrollRef.current;
  const isPcWindow = window.matchMedia('(min-width:1024px)').matches;

  const handleScroll = async () => {
    if (!scrollRefCurrent) return;

    let contentsHeight;
    if (isPcWindow) {
      contentsHeight = window.innerHeight;
    } else {
      contentsHeight = window.innerHeight - 112;
    }

    if (
      scrollRefCurrent.scrollHeight !==
      scrollRefCurrent.scrollTop + contentsHeight
    )
      return;

    const roomIdList = await getRoomList(false);
    if (roomIdList) saveRoomData(roomIdList);
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

  return (
    <>
      {renderErrorModal()}
      <main>
        {isLoading && (
          <>
            <div className={`${styles.container} sp`}>
              <Skeleton variant="rectangular" height={64} />
              <Skeleton variant="rectangular" height={64} />
              <Skeleton variant="rectangular" height={64} />
              <Skeleton variant="rectangular" height={64} />
              <Skeleton variant="rectangular" height={64} />
              <Skeleton variant="rectangular" height={64} />
              <Skeleton variant="rectangular" height={64} />
              <Skeleton variant="rectangular" height={64} />
            </div>
            <div className={`${styles.container} pc`}>
              <Skeleton variant="rectangular" height={64} />
              <Skeleton variant="rectangular" height={64} />
              <Skeleton variant="rectangular" height={64} />
              <Skeleton variant="rectangular" height={64} />
              <Skeleton variant="rectangular" height={64} />
              <Skeleton variant="rectangular" height={64} />
              <Skeleton variant="rectangular" height={64} />
              <Skeleton variant="rectangular" height={64} />
              <Skeleton variant="rectangular" height={64} />
              <Skeleton variant="rectangular" height={64} />
              <Skeleton variant="rectangular" height={64} />
            </div>
          </>
        )}
        {!isLoading && (
          <div ref={scrollRef} className={styles.container}>
            {typeof joinedRooms !== 'undefined' && myRoomList.length !== 0 && (
              <AvatarList
                idList={myRoomList}
                joinedRoomsObject={joinedRooms}
                unReadCount={unReadCount}
              />
            )}
          </div>
        )}
      </main>
    </>
  );
};

export default RoomOverview;
