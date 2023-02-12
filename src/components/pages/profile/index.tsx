import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { FirebaseError } from 'firebase/app';
import { useAtom } from 'jotai';

import styles from './index.module.css';

import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Heading';
import Skeleton from '@/components/atoms/Skeleton';
import Modal from '@/components/molecules/Modal';
import AvatarBackgroundImage from '@/components/organisms/AvatarBackgroundImage';
import Header from '@/components/organisms/Header';
import Message from '@/components/organisms/MessageForm';

import { useHome } from '@/features';
import { useUser } from '@/hooks';
import { authUserAtom } from '@/store';
import { getFirebaseError } from '@/utils';

const Profile = () => {
  const [userName, setUserName] = useState('');
  const [myIconUrl, setMyIconUrl] = useState('');
  const [isOpenErrorModal, setIsOpenErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    '予期せぬエラーが発生しました。お手数ですが、再度ログインしてください。'
  );
  const [isLoading, setIsLoading] = useState(true);
  const [authUser] = useAtom(authUserAtom);
  const [friendList, setFriendList] = useState<string[]>([]);
  const navigate = useNavigate();

  const { getUser, saveUser } = useUser();
  const { getGroupIdList, getFriendIdList } = useHome();

  const actionItems = [
    {
      item: '編集',
      onClick: () => navigate('/profile/edit'),
    },
  ];

  const userId = authUser?.uid || '';

  useEffect(() => {
    if (!userId) return;

    try {
      getUser(userId).then((userData) => {
        if (!userData) throw new Error('ユーザー情報がありません。');

        saveUser(userId, userData);

        setUserName(userData.name);
        setMyIconUrl(userData.iconUrl);

        setIsLoading(false);
      });

      getFriendIdList(userId).then((friendIdList) => {
        setFriendList(friendIdList);
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

  return (
    <>
      {renderErrorModal()}
      <Header title="プロフィール" className="sp" actionItems={actionItems} />
      <main className="grow">
        {isLoading && (
          <>
            <div className={`${styles.contents} sp`}>
              <Skeleton variant="rectangular" height={160} />
              <Skeleton variant="circular" height={48} width={48} />
              <section className="inner">
                <Skeleton variant="text" width={120} />
              </section>
            </div>
            <div className={`${styles.myChat} pc`}></div>
          </>
        )}
        {!isLoading && (
          <>
            <div className={`${styles.contents} sp`}>
              <AvatarBackgroundImage
                imageUrl={myIconUrl}
                avatarIconPosition="left"
                isNotUpload
                uploadIconSize="large"
              />
              <section className="inner flex jcc fdrc">
                <Heading tag="h1" align="start" isBold size="xxl">
                  {userName}
                </Heading>
                <span>
                  <FontAwesomeIcon
                    icon={faUser}
                    size="lg"
                    style={{ marginRight: '8px', opacity: 0.3 }}
                  />
                  {friendList.length}
                </span>
              </section>
            </div>
            <div className={`${styles.myChat} pc `}>
              <Message />
            </div>
          </>
        )}
      </main>
    </>
  );
};

export default Profile;
