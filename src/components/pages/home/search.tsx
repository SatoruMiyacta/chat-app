import { useEffect, useState } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';

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
import UsersOverview from '@/components/organisms/UserOverview';

import { useSearch, JoinedRoomsDataObject, useBlock } from '@/features';
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
  const [isSearchResults, setIsSearchResults] = useState(true);

  const { saveFriendIdList, addUserToFriend } = useFriend();
  const { saveJoinedRooms } = useTalkRoom();
  const { getSearchedBlockUser } = useBlock();
  const { convertnotFriendsObject, searchUserList } = useSearch();
  const [searchPatams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const userId = authUser?.uid || '';

  const userPathId = searchPatams.get('userId');

  const searchUser = async () => {
    if (!userId) return;

    try {
      const searchList = await searchUserList(search);

      if (searchList.length === 0) {
        setIsSearchResults(false);
        return;
      }

      const newSearchList = [...searchList];
      const userIdIndex = newSearchList.indexOf(userId);
      if (userIdIndex !== -1) newSearchList.splice(userIdIndex, 1);

      const notFriendsObject = await convertnotFriendsObject(
        searchList,
        userId
      );
      if (notFriendsObject) setUnknownUserIdObject(notFriendsObject);

      const searchedBlockUserIdList = await getSearchedBlockUser(
        newSearchList,
        userId
      );

      if (searchedBlockUserIdList && searchedBlockUserIdList.length !== 0) {
        const newList = newSearchList.filter(
          (i) => searchedBlockUserIdList.indexOf(i) == -1
        );
        setSearchedIdList(newList);
      } else {
        setSearchedIdList(newSearchList);
      }
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
    setIsSearchResults(true);
    setSearchedIdList([]);
    if (!search) {
      setSearchedIdList([]);
    }
  }, [search]);

  const addFriend = async (id: string) => {
    if (!userId) return;

    try {
      await addUserToFriend(userId, id);
      navigate('/search');
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
      <Header title="友達追加" className="sp" showBackButton />
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
              placeholder="ユーザー名を入力してください"
              startIcon={<FontAwesomeIcon icon={faMagnifyingGlass} />}
            />
            <Button
              color="primary"
              variant="contained"
              isRounded={false}
              onClick={searchUser}
              size="large"
            >
              検索
            </Button>
          </div>
          <div className={styles.contents}>
            {isSearchResults && (
              <AvatarList
                idList={searchedIdList}
                addFriend={(id) => addFriend(id)}
                batchIdObject={unknownUserIdObject}
              />
            )}
            {!isSearchResults && <p>ユーザーが見つかりませんでした</p>}
          </div>
        </div>
        <div className="pc">
          {location.pathname === '/search' && !userPathId && (
            <PcNavigation>
              ユーザー名を入力後、ボタンを押してください
            </PcNavigation>
          )}
          {userPathId && <UsersOverview userId={userPathId} />}
        </div>
      </main>
    </>
  );
};
export default Search;
