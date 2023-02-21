import { useEffect, useState } from 'react';

import { FirebaseError } from 'firebase/app';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useAtom } from 'jotai';

import styles from './search.module.css';

import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Heading';
import Input from '@/components/atoms/Input';
import Modal from '@/components/molecules/Modal';
import Avatar from '@/components/organisms/Avatar';
import AvatarList, { IdObject } from '@/components/organisms/AvatarList';
import Header from '@/components/organisms/Header';

import { useSearch } from '@/features';
import { InitialUserData } from '@/features/useCreateAccount';
import { useUser, useFriend } from '@/hooks';
import { db } from '@/main';
import { authUserAtom, usersAtom, friendsIdAtom } from '@/store';
import { getFirebaseError } from '@/utils';

const Search = () => {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useAtom(usersAtom);
  const [searchedIdList, setSearchedIdList] = useState<string[]>([]);
  const [unknownUserIdList, setUnknownUserIdList] = useState<IdObject>({});
  const [authUser] = useAtom(authUserAtom);
  const [friends, setFriends] = useAtom(friendsIdAtom);
  const [errorMessage, setErrorMessage] = useState(
    '予期せぬエラーが発生しました。お手数ですが、再度ログインしてください。'
  );
  const [isOpenErrorModal, setIsOpenErrorModal] = useState(false);
  const [friendIdList, setFriendIdList] = useState<string[]>([]);

  const {
    setLastFriend,
    getMyFriendIdList,
    saveFriendIdList,
    saveFriendData,
    searchFriendsIdList,
    setFriendList,
    friendList,
  } = useFriend();
  const { getUser, saveUser, getSearchedUser, getSearchedFriends } = useUser();
  const { convertnotFriendsObject, searchUserList } = useSearch();

  const userId = authUser?.uid || '';

  const searchUser = async () => {
    const searchList = await searchUserList(search);
    const notFriendsObject = await convertnotFriendsObject(searchList, userId);
    if (notFriendsObject) setUnknownUserIdList(notFriendsObject);

    setSearchedIdList(searchList);
  };

  useEffect(() => {
    if (!userId) return;
    try {
      searchUser();
    } catch (error) {
      if (error instanceof FirebaseError) {
        const errorCode = error.code;
        setErrorMessage(getFirebaseError(errorCode));
      } else if (error instanceof Error) {
        setErrorMessage(error.message);
      }
      setIsOpenErrorModal(true);
    }
  }, [search]);

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
      <div className={styles.container}>
        <div className={`${styles.searchForm} inner`}>
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
        </div>
        <AvatarList idList={searchedIdList} batch={unknownUserIdList} />
      </div>
      <div className={`${styles.myChat} pc`}></div>
    </>
  );
};
export default Search;
