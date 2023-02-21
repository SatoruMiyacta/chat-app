import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

import { FirebaseError } from 'firebase/app';
import { useAtom } from 'jotai';

import styles from './index.module.css';

import {
  faMagnifyingGlass,
  faUser,
  faUsers,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Button from '@/components/atoms/Button';
import Fab from '@/components/atoms/FloatingActionButton';
import Heading from '@/components/atoms/Heading';
import Input from '@/components/atoms/Input';
import Tabs from '@/components/atoms/Tabs';
import Modal from '@/components/molecules/Modal';
import Avatar from '@/components/organisms/Avatar';
import AvatarBackgroundImage from '@/components/organisms/AvatarBackgroundImage';
import AvatarList from '@/components/organisms/AvatarList';
import BottomNavigation from '@/components/organisms/BottomNavigation';
import Header from '@/components/organisms/Header';

import { INITIAL_ICON_URL } from '@/constants';
import { useHome, useSearch } from '@/features';
import { useUser, useGroup } from '@/hooks';
import { useFriend } from '@/hooks/useFriend';
import { db } from '@/main';
import {
  usersAtom,
  authUserAtom,
  UserData,
  groupsAtom,
  friendsIdAtom,
} from '@/store';
import {
  getFirebaseError,
  getCacheExpirationDate,
  fetchUserData,
  isCacheActive,
  fetchNextfriendsData,
} from '@/utils';

const Home = () => {
  const [search, setSearch] = useState('');
  const [authUser, setAuthUser] = useAtom(authUserAtom);
  const [users, setUsers] = useAtom(usersAtom);
  const [friends, setFriends] = useAtom(friendsIdAtom);
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  // const [friendList, setFriendList] = useState<string[]>([]);
  // const [groupList, setJoinedGroupList] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState(
    '予期せぬエラーが発生しました。お手数ですが、再度ログインしてください。'
  );
  const [isOpenErrorModal, setIsOpenErrorModal] = useState(false);

  const {
    getMyGroupIdList,
    saveGroupsIdList,
    saveGroupData,
    setJoinedGroupList,
    joinedGroupList,
    searchGroupList,
  } = useHome();

  const {
    setLastFriend,
    getMyFriendIdList,
    saveFriendIdList,
    saveFriendData,
    searchFriendsIdList,
    setFriendList,
    friendList,
  } = useFriend();

  const {
    getSearchedGroups,
    getGroups,
    saveGroups,
    saveJoinedGroups,
    getSearchedGroup,
  } = useGroup();

  const { getUser, saveUser, getSearchedFriends } = useUser();
  const { convertnotFriendsObject, searchUserList } = useSearch();

  const tabs = [
    {
      label: '友達',
      icon: <FontAwesomeIcon icon={faUser} />,
      isDisabled: false,
    },
    {
      label: 'グループ',
      icon: <FontAwesomeIcon icon={faUsers} />,
      isDisabled: false,
    },
  ];

  const changeActiveTab = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    index: number
  ) => {
    if (tabs[index] !== tabs[activeIndex]) setActiveIndex(index);
  };

  const userId = authUser?.uid || '';
  useEffect(() => {
    try {
      if (!userId) return;
      getMyFriendIdList(true).then((friendIdList) => {
        saveFriendData(friendIdList);
        saveFriendIdList(friendIdList);
      });

      getMyGroupIdList(true).then((groupIdList) => {
        saveGroupData(groupIdList);
        saveGroupsIdList(groupIdList);
      });
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

  const searchFriend = async () => {
    const searchList = await searchUserList(search);
    const searchedFriendsIdList = await getSearchedFriends(searchList, userId);
    if (searchedFriendsIdList) {
      setFriendList(searchedFriendsIdList);
    } else {
      setFriendList([]);
    }
  };

  const searchGroup = async () => {
    const searchList = await searchGroupList(search);
    const searchedGroupsIdList = await getSearchedGroups(searchList, userId);
    if (searchedGroupsIdList) {
      setJoinedGroupList(searchedGroupsIdList);
    } else {
      setJoinedGroupList([]);
    }
  };

  useEffect(() => {
    if (!userId) return;

    try {
      if (activeIndex === 0) {
        if (!search) {
          getMyFriendIdList(true).then((friendIdList) => {
            saveFriendData(friendIdList);
            saveFriendIdList(friendIdList);
          });
        } else {
          searchFriend();
        }
      } else if (activeIndex === 1) {
        if (!search) {
          getMyGroupIdList(true).then((groupIdList) => {
            saveGroupData(groupIdList);
            saveGroupsIdList(groupIdList);
          });
        } else {
          searchGroup();
        }
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
  }, [search]);

  const handleScroll = async () => {
    if (document.body.scrollHeight !== window.pageYOffset + window.innerHeight)
      return;

    if (activeIndex === 0) {
      getMyFriendIdList(false).then((friendIdList) => {
        saveFriendData(friendIdList);
        saveFriendIdList(friendIdList);
      });
    } else if (activeIndex === 1) {
      getMyGroupIdList(true).then((groupIdList) => {
        saveGroupData(groupIdList);
        saveGroupsIdList(groupIdList);
      });
    }
  };
  useEffect(() => {
    window.document.addEventListener('scroll', handleScroll);
    return () => {
      window.document.removeEventListener('scroll', handleScroll);
    };
  }, []);

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

  const navigatePath = () => {
    if (activeIndex === 0) {
      return navigate('/search');
    } else {
      return navigate('/group/create');
    }
  };

  return (
    <>
      {renderErrorModal()}
      <Header title="ホーム" className="sp" />
      <div className={styles.container}>
        <div className={styles.tabs}>
          <Tabs
            activeIndex={activeIndex}
            color="black"
            items={tabs}
            onClick={(event, index) => changeActiveTab(event, index)}
            isBorder
          />
        </div>
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
        <div className={styles.contents}>
          {activeIndex === 0 && <AvatarList idList={friendList} />}
          {activeIndex === 1 && <AvatarList idList={joinedGroupList} isGroup />}
          <div className={styles.fab}>
            <Fab
              color="primary"
              onClick={() => navigatePath()}
              variant="circular"
              size="large"
            >
              <FontAwesomeIcon icon={faPlus} />
            </Fab>
          </div>
        </div>
      </div>
      <div className="sp">
        <BottomNavigation />
      </div>
      <div className={`${styles.myChat} pc`}></div>
    </>
  );
};

export default Home;
