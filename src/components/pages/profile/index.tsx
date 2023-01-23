import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAtom } from 'jotai';

import styles from './index.module.css';

import Heading from '@/components/atoms/Heading';
import BackgroundImage from '@/components/organisms/BackgroundImage';
import Header from '@/components/organisms/Header';

import { useProfile } from '@/hooks';
import { authUserAtom, UserData, usersAtom } from '@/store';

const Profile = () => {
  const [authUser, setAuthUser] = useAtom(authUserAtom);
  const [users, setUsers] = useAtom(usersAtom);
  const [userName, setUserName] = useState('');
  const [myIconUrl, setMyIconUrl] = useState('');
  const navigate = useNavigate();

  const { fetchUserData } = useProfile();

  const actionItems = [
    {
      item: '編集',
      onClick: () => navigate('/profile/edit'),
    },
  ];

  try {
    // キャッシュのタイムアウト設定
    if (authUser) {
      const userId = authUser.uid;
      const now = new Date();

      if (users[userId] === undefined || users[userId].expiresIn < now) {
        fetchUserData(userId).then((data) => {
          if (!data) return;

          const userData: UserData = {
            name: data.name,
            iconUrl: data.iconUrl,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
          };

          setUsers((prevState) => ({
            ...prevState,
            [userId]: { data: userData, expiresIn: now },
          }));

          setUserName(userData.name);
          setMyIconUrl(userData.iconUrl);
        });
      } else {
        if (userName === '') setUserName(users[userId].data.name);

        if (myIconUrl === '') setMyIconUrl(users[userId].data.iconUrl);
      }
    }
  } catch (error) {
    console.error(error);
  }

  const isPcWindow = window.matchMedia('(min-width:1024px)').matches;
  return (
    <>
      <Header title="プロフィール" className="sp" actionItems={actionItems} />
      <main className={styles.container}>
        <BackgroundImage
          className={styles.BackgroundImage}
          iconPosition={isPcWindow ? 'left' : 'under'}
          iconUrl={myIconUrl}
          uploadIconButtonSize={isPcWindow ? 'medium' : 'small'}
        />
        <div className={styles.contents}>
          <Heading tag="h2" align="center" isBold>
            {userName}
          </Heading>
        </div>
      </main>
    </>
  );
};

export default Profile;
