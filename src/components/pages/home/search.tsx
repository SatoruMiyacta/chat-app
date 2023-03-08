import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { FirebaseError } from 'firebase/app';
import { useAtom } from 'jotai';

import styles from './search.module.css';

import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Modal from '@/components/molecules/Modal';
import AvatarList, { IdObject } from '@/components/organisms/AvatarList';
import Header from '@/components/organisms/Header';
import PcNavigation from '@/components/organisms/PcNavigation';

import { useSearch, JoinedRoomsDataObject } from '@/features';
import { useFriend, useTalkRoom } from '@/hooks';
import { authUserAtom, friendsIdAtom } from '@/store';
import {
  getFirebaseError,
  setFriend,
  searchUnAuthRoom,
  deleteUnAuthRoom,
  setUsersJoinedRooms,
  addRoom,
  setUnAuthRoom,
  getJoinedRoomData,
} from '@/utils';
const Search = () => {
  const [search, setSearch] = useState('');
  const [searchedIdList, setSearchedIdList] = useState<string[]>([]);
  const [unknownUserIdObject, setUnknownUserIdObject] = useState<IdObject>({});
  const [authUser] = useAtom(authUserAtom);
  const [friends] = useAtom(friendsIdAtom);
  const [errorMessage, setErrorMessage] = useState(
    '予期せぬエラーが発生しました。お手数ですが、再度ログインしてください。'
  );
  const [isOpenErrorModal, setIsOpenErrorModal] = useState(false);

  const { saveFriendIdList } = useFriend();
  const { saveJoinedRooms } = useTalkRoom();
  const { convertnotFriendsObject, searchUserList } = useSearch();
  const navigate = useNavigate();
  const location = useLocation();
  const userId = authUser?.uid || '';

  const searchUser = async () => {
    if (!userId) return;
    try {
      const searchList = await searchUserList(search);
      const notFriendsObject = await convertnotFriendsObject(
        searchList,
        userId
      );
      if (notFriendsObject) setUnknownUserIdObject(notFriendsObject);

      setSearchedIdList(searchList);
    } catch (error) {
      if (error instanceof FirebaseError) {
        const errorCode = error.code;
        setErrorMessage(getFirebaseError(errorCode));
      } else if (error instanceof Error) {
        setErrorMessage(error.message);
      }
      setIsOpenErrorModal(true);
    }
  };

  useEffect(() => {
    if (!search) setSearchedIdList([]);
  }, [search]);

  const addFriend = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: string
  ) => {
    if (!userId) return;

    try {
      const type = 'user';
      const querySnapshot = await searchUnAuthRoom(userId, id, type);

      if (querySnapshot && querySnapshot.docs.length !== 0) {
        for (const doc of querySnapshot.docs) {
          const roomId = doc.id;
          const roomData = doc.data();
          const type = roomData.type;
          const isVisible = true;
          const anotherId = id;

          const joinedRoomsDataObject: JoinedRoomsDataObject = {
            anotherId,
            type,
            isVisible,
          };

          await setUsersJoinedRooms(userId, roomId, joinedRoomsDataObject);
          await deleteUnAuthRoom(userId, roomId);
        }
      } else {
        const type = 'user';
        const roomId = await addRoom(userId);
        const isVisible = true;
        const anotherId = id;

        const joinedRoomsDataObject: JoinedRoomsDataObject = {
          anotherId,
          type,
          isVisible,
        };

        await setUsersJoinedRooms(userId, roomId, joinedRoomsDataObject);

        const data = await getJoinedRoomData(userId, roomId);

        if (data) saveJoinedRooms(roomId, data);

        await setUnAuthRoom(userId, id, roomId, type);
      }

      if (friends && typeof friends !== 'undefined') {
        const friendsCacheList = friends.data as string[];
        friendsCacheList.unshift(id);
        saveFriendIdList(friendsCacheList);
      }

      await setFriend(userId, id);
      navigate(`/`);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else if (error instanceof FirebaseError) {
        const errorCode = error.code;
        setErrorMessage(getFirebaseError(errorCode));
      }
    }
  };

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
      <Header title="ユーザー検索" className="sp" showBackButton />
      <main className={styles.pcLayout}>
        <div className={styles.container}>
          <div className={`${styles.searchForm} flex inner`}>
            <Input
              color="primary"
              id="search"
              onChange={(event) => setSearch(event.target.value)}
              type="text"
              value={search}
              variant="filled"
              isFullWidth
              placeholder="search"
              startIcon={<FontAwesomeIcon icon={faMagnifyingGlass} />}
            />
            <button onClick={searchUser}>検索</button>
          </div>
          <AvatarList
            idList={searchedIdList}
            addFriend={addFriend}
            batchIdObject={unknownUserIdObject}
            path={'/search'}
          />
        </div>
        {location.pathname === '/search' && (
          <div className="pc">
            <PcNavigation>
              ユーザー名を入力後、ボタンを押してください
            </PcNavigation>
          </div>
        )}
      </main>
    </>
  );
};
export default Search;
