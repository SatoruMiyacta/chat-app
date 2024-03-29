import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { FirebaseError } from 'firebase/app';
import { signOut } from 'firebase/auth';
import { useAtom } from 'jotai';

import styles from './index.module.css';

import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Heading';
import Skeleton from '@/components/atoms/Skeleton';
import Modal from '@/components/molecules/Modal';
import AvatarBackgroundImage from '@/components/organisms/AvatarBackgroundImage';
import BottomNavigation from '@/components/organisms/BottomNavigation';
import Header from '@/components/organisms/Header';
import MessageForm from '@/components/organisms/MessageForm';

import { useUser, useAuth } from '@/hooks';
import { useFriend } from '@/hooks/useFriend';
import { auth } from '@/main';
import { authUserAtom } from '@/store';
import { getFirebaseError } from '@/utils';

const Profile = () => {
  const [userName, setUserName] = useState('');
  const [myIconUrl, setMyIconUrl] = useState('');
  const [isOpenErrorModal, setIsOpenErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    '予期せぬエラーが発生しました。お手数ですが、再度ログインしてください。'
  );
  const [isOpenLogOutModal, setIsOpenLogOutModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authUser] = useAtom(authUserAtom);
  const [friendList, setFriendList] = useState<string[]>([]);
  const navigate = useNavigate();

  const { getUser, saveUser } = useUser();
  const { getMyFriendIdList } = useFriend();
  const { resetCache } = useAuth();

  const actionItems = [
    {
      item: '編集',
      onClick: () => navigate('/profile/edit'),
    },
  ];

  const userId = authUser?.uid;

  const logOut = async () => {
    try {
      await signOut(auth);
      resetCache();
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else if (error instanceof FirebaseError) {
        const errorCode = error.code;
        setErrorMessage(getFirebaseError(errorCode));
      }

      setIsOpenErrorModal(true);
    }
  };

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

      setIsLoading(false);
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

  const logOutModal = () => {
    if (!isOpenLogOutModal) return;

    return (
      <Modal
        onClose={() => setIsOpenLogOutModal(false)}
        title="サインアウト"
        titleAlign="center"
        hasInner
        isOpen={isOpenLogOutModal}
        isBoldTitle
      >
        <div>
          <p>
            サインアウトした場合、再度サービスをご利用するためにはサインインが必要となります
          </p>
        </div>
        <div className={styles.controler}>
          <Button
            color="primary"
            onClick={logOut}
            variant="contained"
            isFullWidth
            size="small"
          >
            OK
          </Button>
          <Button
            color="primary"
            onClick={() => setIsOpenLogOutModal(false)}
            variant="outlined"
            isFullWidth
            size="small"
          >
            キャンセル
          </Button>
        </div>
      </Modal>
    );
  };

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
      {logOutModal()}
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
                uploadIconSize="l"
              />
              <section className="inner flex jcc fdrc">
                <Heading tag="h1" align="start" isBold size="xxl">
                  {userName}
                </Heading>
                <span>{`友達 ${friendList.length}`}</span>
              </section>
              <div className={`${styles.buttonArea} inner`}>
                <Button
                  color="primary"
                  onClick={() => setIsOpenLogOutModal(true)}
                  variant="outlined"
                  isFullWidth
                >
                  サインアウト
                </Button>
              </div>
            </div>
            <div className={`${styles.myChat} pc `}>
              {userId && <MessageForm postId={userId} />}
            </div>
          </>
        )}
      </main>
      <div className="sp">
        <BottomNavigation />
      </div>
    </>
  );
};

export default Profile;
