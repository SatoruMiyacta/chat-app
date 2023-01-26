import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
  faMagnifyingGlass,
  faUser,
  faUsers,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Fab from '@/components/atoms/FloatingActionButton';
import Heading from '@/components/atoms/Heading';
import Input from '@/components/atoms/Input';
import Tabs from '@/components/atoms/Tabs';
import BackgroundImage from '@/components/organisms/BackgroundImage';
import BottomNavigation from '@/components/organisms/BottomNavigation';
import Header from '@/components/organisms/Header';

import { useHome } from '@/hooks';
import { db } from '@/main';
import { usersAtom, authUserAtom, UserData } from '@/store';

const Home = () => {
  const [search, setSearch] = useState('');
  const [authUser, setAuthUser] = useAtom(authUserAtom);
  const [users, setUsers] = useAtom(usersAtom);
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [friendList, setFriendList] = useState([{}]);
  const { fetchfriendsData, fetchGloupsData } = useHome();

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

  const activeTabs = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    index: number
  ) => {
    if (tabs[index] !== tabs[activeIndex]) setActiveIndex(index);
  };

  try {
    if (authUser) {
      const userId = authUser.uid;

      if (!friendList) {
        fetchfriendsData(userId).then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            setFriendList([{ id: doc.id }]);
          });
        });
      }
    }
  } catch (error) {
    if (error instanceof FirebaseError) {
      const errorCode = error.code;
      console.error(errorCode);
      // setModalMessage(getFirebaseError(errorCode));
    } else if (error instanceof Error) {
      // setModalMessage(error.message);
    }
  }

  // const showFriensList = () => {
  //   return (
  //     <div className={styles.list}>
  //       {friends.map((list, index) => (
  //         <ul
  //           key={`tabs-${index}`}
  //           className={`${styles.oneLine} flex alic inner`}
  //         >
  //           {/* <li>
  //             <BackgroundImage
  //               iconUrl={list.iconUrl}
  //               uploadIconButtonSize="small"
  //             />
  //           </li>
  //           <li>
  //             <Heading tag="h1" size="l">
  //               {list.userName}
  //             </Heading>
  //           </li> */}
  //         </ul>
  //       ))}
  //     </div>
  //   );
  // };

  // const showGroupsList = () => {
  //   return (
  //     <div className={styles.list}>
  //       {groups.map((list, index) => (
  //         <ul
  //           key={`tabs-${index}`}
  //           className={`${styles.oneLine} flex alic inner`}
  //         >
  //           <li>
  //             <BackgroundImage
  //               iconUrl={list.iconUrl}
  //               uploadIconButtonSize="small"
  //             />
  //           </li>
  //           <li>
  //             <Heading tag="h1" size="l">
  //               {list.groupName}
  //             </Heading>
  //           </li>
  //         </ul>
  //       ))}
  //     </div>
  //   );
  // };

  return (
    <>
      <Header title="ホーム" />
      <div className={styles.container}>
        <div className={styles.tabs}>
          <Tabs
            activeIndex={activeIndex}
            color="black"
            items={tabs}
            onClick={(event, index) => activeTabs(event, index)}
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
          {/* {activeIndex === 0 ? showFriensList() : showGroupsList()} */}
          <Fab
            color="primary"
            onClick={() => {
              tabs[0] ? navigate('/search') : navigate('/groups/create');
            }}
            variant="circular"
            className={styles.fab}
            size="large"
          >
            <FontAwesomeIcon icon={faPlus} />
          </Fab>
        </div>
        <div>
          <BottomNavigation />
        </div>
      </div>
    </>
  );
};

export default Home;
