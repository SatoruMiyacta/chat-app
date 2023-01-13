import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAtom } from 'jotai';

import styles from './index.module.css';

import Heading from '@/components/atoms/Heading';
import BackgroundImage from '@/components/organisms/BackgroundImage';
import Header, { ActionItem } from '@/components/organisms/Header';

import { useProfile } from '@/hooks/useProfile';
import { authUserAtom, UserData, usersAtom } from '@/store/user';

const Profile = () => {
  const [authUser, setAuthUser] = useAtom(authUserAtom);
  const [users, setUsers] = useAtom(usersAtom);

  const navigate = useNavigate();
  const { fetchUserData, myIconUrl, userName } = useProfile();
  const [actionItems, setActionItems] = useState<ActionItem[]>([
    {
      item: '編集',
      onClick: () => navigate('/profile/edit'),
    },
  ]);

  try {
    // キャッシュのタイムアウト設定

    // [userId: string]: { data: UserData; expiresIn: Date };

    if (authUser) {
      const userId = authUser.uid;
      const date = new Date();
      if (users[userId].expiresIn < date) {
        // const data = await fetchUserData(userId);
        fetchUserData(userId).then((data) => {
          if (!data) return;
          const userData: UserData = {
            name: data.name,
            iconUrl: data.iconUrl,
            createdAt: data.createdAt.toDate(),
            updateAt: data.updateAt.toDate(),
          };
          setUsers({ userId: { data: userData, expiresIn: date } });
        });
      }
    }
  } catch (error) {
    console.log(error);
  }

  return (
    <>
      <Header title="プロフィール" actionItems={actionItems} showBackButton />
      <main>
        <BackgroundImage
          className={styles.BackgroundImage}
          iconPosition="under"
          iconUrl={myIconUrl}
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
