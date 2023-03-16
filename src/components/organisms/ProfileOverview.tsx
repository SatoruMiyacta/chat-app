import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { FirebaseError } from 'firebase/app';
import { useAtom } from 'jotai';

import styles from './ProfileOverview.module.css';

import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Heading';
import Modal from '@/components/molecules/Modal';
import AvatarBackgroundImage from '@/components/organisms/AvatarBackgroundImage';

import { useUser } from '@/hooks';
import { useFriend } from '@/hooks/useFriend';
import { authUserAtom, usersAtom } from '@/store';
import { getFirebaseError } from '@/utils';

const ProfileOverview = () => {
  const [userName, setUserName] = useState('');
  const [authUser] = useAtom(authUserAtom);
  const [users] = useAtom(usersAtom);
  const [friendList, setFriendList] = useState<string[]>([]);
  const [myIconUrl, setMyIconUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState(
    '予期せぬエラーが発生しました。お手数ですが、再度ログインしてください。'
  );
  const [isOpenErrorModal, setIsOpenErrorModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { getUser, saveUser } = useUser();
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
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else if (error instanceof FirebaseError) {
        const errorCode = error.code;
        setErrorMessage(getFirebaseError(errorCode));
      }

      setIsOpenErrorModal(true);
    }
  }, [userId, JSON.stringify(users[userId]?.data)]);

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
      {renderErrorModal()}
      <main className={styles.container}>
        <div className={styles.contents}>
          <AvatarBackgroundImage
            imageUrl={myIconUrl}
            avatarIconPosition="left"
            isNotUpload
            uploadIconSize="l"
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
