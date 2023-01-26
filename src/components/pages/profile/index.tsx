import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAtom } from 'jotai';

import styles from './index.module.css';

import { faCamera, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Heading';
import Input from '@/components/atoms/Input';
import BackgroundImage from '@/components/organisms/BackgroundImage';
import Header from '@/components/organisms/Header';
import Message from '@/components/organisms/Message';

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

  const handleChange = () => {
    console.log('');
  };

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
        <div className={styles.BackgroundImage}>
          <BackgroundImage
            hasBackgroundImage
            iconPosition={isPcWindow ? 'left' : 'under'}
            iconUrl={myIconUrl}
            uploadIconButtonSize={isPcWindow ? 'medium' : 'small'}
          />
        </div>
        <section className={`${styles.contents} inner`}>
          <Heading tag="h2" align={isPcWindow ? 'start' : 'center'} isBold>
            {userName}
          </Heading>
          {isPcWindow && (
            <Button
              color="primary"
              variant="contained"
              onClick={() => navigate('/profile/create')}
            >
              編集
            </Button>
          )}
        </section>
      </main>
      <aside className={`${styles.aside} pc`}>
        <Message />
      </aside>
    </>
  );
};

export default Profile;
