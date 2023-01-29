import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './spIndex.module.css';

import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Heading';
import Modal from '@/components/molecules/Modal';
import BackgroundImage from '@/components/organisms/BackgroundImage';
import Header from '@/components/organisms/Header';
import IconImage from '@/components/organisms/IconImage';
import Message from '@/components/organisms/MessageForm';

import { useExchangeData } from '@/hooks';
import { auth } from '@/main';

const SpProfile = () => {
  const [userName, setUserName] = useState('');
  const [myIconUrl, setMyIconUrl] = useState('');
  const [isOpenErrorModal, setIsOpenErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    '予期せぬエラーが発生しました。お手数ですが、再度ログインしてください。'
  );
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const { getUserData, userId, updateCacheUserData } = useExchangeData();

  const actionItems = [
    {
      item: '編集',
      onClick: () => navigate('/profile/edit'),
    },
  ];

  useEffect(() => {
    if (!userId) return;

    getUserData(userId)
      .then((userData) => {
        if (!userData) throw new Error('ユーザー情報がありません。');

        updateCacheUserData(userId, userData);

        setUserName(userData.name);
        setMyIconUrl(userData.iconUrl);

        setIsLoading(false);
      })
      .catch((error) => {
        if (error instanceof Error) {
          setErrorMessage(error.message);
        }

        setIsOpenErrorModal(true);
      });
  }, [userId]);

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

  const isPcWindow = window.matchMedia('(min-width:1024px)').matches;
  return (
    <>
      {renderErrorModal()}
      <Header title="プロフィール" className="sp" actionItems={actionItems} />
      <main>
        {isLoading && (
          <Heading tag="h1" align="center" isBold>
            ローディング中...
          </Heading>
        )}
        {!isLoading && (
          <>
            <div className={`${styles.BackgroundImage} sp`}>
              <BackgroundImage imageUrl={myIconUrl} childrenPosition="under">
                <IconImage iconUrl={myIconUrl} isNotUpload />
              </BackgroundImage>
            </div>
            <section className={`${styles.contents} inner sp`}>
              <Heading tag="h2" align="center" isBold>
                {userName}
              </Heading>
            </section>
            <div className={`${styles.myChat} pc`}></div>
          </>
        )}
      </main>
    </>
  );
};

export default SpProfile;
