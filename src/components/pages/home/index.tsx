import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

import { FirebaseError } from 'firebase/app';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  QuerySnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { useAtom } from 'jotai';

import styles from './index.module.css';

import {
  faHouse,
  faCircleUser,
  faComment,
} from '@fortawesome/free-solid-svg-icons';
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
import BottomNavigation from '@/components/organisms/BottomNavigation';
import Header from '@/components/organisms/Header';

import { INITIAL_ICON_URL } from '@/constants';
import { useUser, useGroup } from '@/features';
import { useHome } from '@/hooks';
import { db } from '@/main';
import { usersAtom, authUserAtom, UserData, groupsAtom } from '@/store';
import {
  getFirebaseError,
  getCacheExpirationDate,
  fetchUserData,
  isCacheActive,
} from '@/utils';

const Home = () => {
  const [search, setSearch] = useState('');
  const [authUser, setAuthUser] = useAtom(authUserAtom);
  const [users, setUsers] = useAtom(usersAtom);
  const [groups, setGroups] = useAtom(groupsAtom);
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [friendList, setFriendList] = useState<string[]>([]);
  const [groupList, setGroupList] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState(
    '予期せぬエラーが発生しました。お手数ですが、再度ログインしてください。'
  );
  const [isOpenErrorModal, setIsOpenErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isOpenModal, setIsOpenModal] = useState(false);

  const [modalAvatarUrl, setModalAvatarUrl] = useState('');
  const [modalAvatarname, setModalAvatarname] = useState('');

  const { getGroupIdList, getFriendIdList } = useHome();

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

      getFriendIdList(userId).then((friendIdList) => {
        setFriendList(friendIdList);
      });

      getGroupIdList(userId).then((groupIdList) => {
        setGroupList(groupIdList);
      });
    } catch (error) {
      if (error instanceof Error) {
        setModalMessage(error.message);
      } else if (error instanceof FirebaseError) {
        const errorCode = error.code;
        setModalMessage(getFirebaseError(errorCode));
      }

      setIsOpenModal(true);
    }
  }, [userId]);

  const showFriendsList = () => {
    if (!userId) return;
    if (!users[friendList[0]]) return;

    return (
      <div className={styles.list}>
        {friendList.map((list) => (
          <ul key={list} className={`${styles.oneLine} flex alic inner`}>
            <li>
              <button
                className="flex alic"
                onClick={() => {
                  setModalAvatarUrl(users[list].data.iconUrl);
                  setModalAvatarname(users[list].data.name);
                  setIsOpenModal(true);
                }}
                type="button"
              >
                <Avatar
                  iconUrl={users[list].data.iconUrl}
                  uploadIconSize="small"
                  isNotUpload
                />
                <Heading tag="h1">{users[list].data.name}</Heading>
              </button>
            </li>
          </ul>
        ))}
      </div>
    );
  };

  const showGroupsList = () => {
    if (!userId) return;
    if (!groups[groupList[0]]) return;

    return (
      <div className={styles.list}>
        {groupList.map((list) => (
          <ul key={list} className={`${styles.oneLine} flex alic inner`}>
            <li>
              <button
                className="flex alic"
                onClick={() => {
                  setModalAvatarUrl(users[list].data.iconUrl);
                  setModalAvatarname(users[list].data.name);
                  setIsOpenModal(true);
                }}
                type="button"
              >
                <Avatar
                  iconUrl={groups[list].data.iconUrl}
                  uploadIconSize="small"
                  isNotUpload
                />
                <Heading tag="h1">{groups[list].data.name}</Heading>
              </button>
            </li>
          </ul>
        ))}
      </div>
    );
  };

  useEffect(() => {
    if (!search && !friendList) {
      getFriendIdList(userId).then((friendIdList) => {
        setFriendList(friendIdList);
      });
    }
    const resultList = Object.keys(users).filter(
      (key) => users[key].data.name.indexOf(search) > -1
    );

    setFriendList(resultList);
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

  const renderUserModal = () => {
    if (!isOpenModal) return;

    return (
      <div className={styles.modal}>
        <Modal
          onClose={() => setIsOpenModal(false)}
          hasInner
          isOpen={isOpenModal}
        >
          <div className={styles.avatarArea}>
            <Avatar
              iconUrl={modalAvatarUrl}
              isNotUpload
              uploadIconSize="large"
            />
            <Heading tag="h1" align="center" size="xl">
              {modalAvatarname}
            </Heading>
          </div>
          <div className={styles.controler}>
            <button>
              <Link to={'/rooms'}>
                <FontAwesomeIcon
                  icon={faComment}
                  style={{ marginBottom: '4px' }}
                  size={'xl'}
                />
                トーク
              </Link>
            </button>
            <button>
              <Link to={'/rooms'}>
                <FontAwesomeIcon
                  icon={faCircleUser}
                  style={{ marginBottom: '4px' }}
                  size={'xl'}
                />
                プルフィール
              </Link>
            </button>
          </div>
        </Modal>
      </div>
    );
  };

  const navigatePath = () => {
    if (activeIndex === 0) {
      return navigate('/search');
    } else {
      return navigate('/groups/create');
    }
  };

  return (
    <>
      {renderUserModal()}
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
          {activeIndex === 0 ? showFriendsList() : showGroupsList()}
          <Fab
            color="primary"
            onClick={() => navigatePath()}
            variant="circular"
            className={styles.fab}
            size="large"
          >
            <FontAwesomeIcon icon={faPlus} />
          </Fab>
        </div>
      </div>
      <div className={`${styles.myChat} pc`}></div>
    </>
  );
};

export default Home;
