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
import { useHome } from '@/features';
import { useUser, useGroup } from '@/hooks';
import { db } from '@/main';
import { usersAtom, authUserAtom, UserData, groupsAtom } from '@/store';
import {
  getFirebaseError,
  getCacheExpirationDate,
  fetchUserData,
  isCacheActive,
} from '@/utils';

const Rooms = () => {
  const [authUser, setAuthUser] = useAtom(authUserAtom);
  const [users, setUsers] = useAtom(usersAtom);
  const [errorMessage, setErrorMessage] = useState(
    '予期せぬエラーが発生しました。お手数ですが、再度ログインしてください。'
  );
  const [isOpenErrorModal, setIsOpenErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [roomList, setRoomList] = useState([]);
  const navigate = useNavigate();

  const userId = authUser?.uid || '';
  useEffect(() => {
    try {
      if (!userId) return;
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

  return (
    <>
      <Header title="トーク" />
      <div className={styles.list}>
        {roomList.map((list) => (
          <ul key={list} className={`${styles.oneLine} flex alic inner`}>
            <li>
              <button
                className="flex alic"
                onClick={() => navigate(`/rooms/${userId}`)}
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
    </>
  );
};

export default Rooms;
