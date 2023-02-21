import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { useAtom } from 'jotai';

import styles from './ProfileOverview.module.css';

import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Heading';
import IconImage from '@/components/organisms/Avatar';
import AvatarBackgroundImage from '@/components/organisms/AvatarBackgroundImage';
import Header from '@/components/organisms/Header';
import Message from '@/components/organisms/MessageForm';

import { INITIAL_ICON_URL } from '@/constants';
import { useHome } from '@/features';
import { useUser } from '@/hooks';
import { useFriend } from '@/hooks/useFriend';
import { auth } from '@/main';
import { authUserAtom } from '@/store';

const ProfileOverview = () => {
  const [userName, setUserName] = useState('');
  const [authUser] = useAtom(authUserAtom);
  const [friendList, setFriendList] = useState<string[]>([]);
  const [myIconUrl, setMyIconUrl] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const { getUser, saveUser } = useUser();
  // const { getGroupIdList } = useHome();
  const { getMyFriendIdList } = useFriend();

  const userId = authUser?.uid || '';

  useEffect(() => {
    if (!userId) return;

    try {
      getUser(userId).then((userData) => {
        if (!userData) throw new Error('ユーザー情報がありません。');

        saveUser(userId, userData);

        setUserName(userData.name);
        setMyIconUrl(userData.iconUrl);
      });

      getMyFriendIdList(false).then((friendIdList) => {
        setFriendList(friendIdList);
      });
    } catch (error) {
      console.log(error);
    }
  }, [userId]);

  const showEditButton = () => {
    if (location.pathname !== '/profile') return;
    return (
      <Button
        color="primary"
        variant="contained"
        onClick={() => navigate('/profile/edit')}
      >
        編集
      </Button>
    );
  };

  return (
    <>
      <main className={styles.container}>
        <div className={styles.contents}>
          <AvatarBackgroundImage
            imageUrl={myIconUrl}
            avatarIconPosition="left"
            isNotUpload
            uploadIconSize="large"
          />
          <div className="flex inner">
            <section>
              <Heading tag="h1" align="start" isBold size="xl">
                {userName}
              </Heading>
              <span>{`友達 ${friendList.length}`}</span>
            </section>
            {showEditButton()}
          </div>
        </div>
      </main>
    </>
  );
};

export default ProfileOverview;
