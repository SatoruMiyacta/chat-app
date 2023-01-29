import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './pcIndex.module.css';

import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Heading';
import BackgroundImage from '@/components/organisms/BackgroundImage';
import Header from '@/components/organisms/Header';
import IconImage from '@/components/organisms/IconImage';
import Message from '@/components/organisms/MessageForm';

import { useExchangeData } from '@/hooks';
import { auth } from '@/main';

const PcProfile = () => {
  const [userName, setUserName] = useState('');
  const [myIconUrl, setMyIconUrl] = useState('');
  const navigate = useNavigate();

  const { getUserData, userId, updateCacheUserData } = useExchangeData();

  useEffect(() => {
    if (!userId) return;

    getUserData(userId)
      .then((userData) => {
        if (!userData) throw new Error('ユーザー情報がありません。');

        updateCacheUserData(userId, userData);

        setUserName(userData.name);
        setMyIconUrl(userData.iconUrl);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [userId]);

  const isPcWindow = window.matchMedia('(min-width:1024px)').matches;
  return (
    <>
      <main className={styles.container}>
        <div className={styles.contents}>
          <BackgroundImage imageUrl={myIconUrl} childrenPosition="left">
            <IconImage iconUrl={myIconUrl} isNotUpload />
          </BackgroundImage>
          <section className="inner">
            <Heading tag="h2" align="start" isBold>
              {userName}
            </Heading>
            <Button
              color="primary"
              variant="contained"
              onClick={() => navigate('/profile/edit')}
            >
              編集
            </Button>
          </section>
        </div>
      </main>
    </>
  );
};

export default PcProfile;
