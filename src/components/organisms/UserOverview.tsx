import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { FirebaseError } from 'firebase/app';

import styles from './UserOverview.module.css';

import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Heading';
import Skeleton from '@/components/atoms/Skeleton';
import Modal from '@/components/molecules/Modal';
import AvatarBackgroundImage from '@/components/organisms/AvatarBackgroundImage';

import { useUser, useFriend } from '@/hooks';
import { getFirebaseError, searchRoomId } from '@/utils';

export interface UserProps {
  userId: string;
}

const UsersOverview = ({ userId }: UserProps) => {
  const [userName, setUserName] = useState('');
  const [iconUrl, setIconUrl] = useState('');
  const [isOpenErrorModal, setIsOpenErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    '予期せぬエラーが発生しました。お手数ですが、再度ログインしてください。'
  );
  const [isLoading, setIsLoading] = useState(true);
  const [friendList, setFriendList] = useState<string[]>([]);
  const navigate = useNavigate();
  const { getMyFriendIdList } = useFriend();
  const { getUser, saveUser } = useUser();

  useEffect(() => {
    if (!userId) return;

    try {
      getUser(userId).then((userData) => {
        if (!userData) throw new Error('ユーザー情報がありません。');

        saveUser(userId, userData);

        setUserName(userData.name);
        setIconUrl(userData.iconUrl);
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

  const navigateRoom = async () => {
    if (!userId) return;

    const roomId = await searchRoomId(userId, userId);
    navigate(`/rooms/${roomId}/message`);
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

  const isPcWindow = window.matchMedia('(min-width:1024px)').matches;
  return (
    <>
      {renderErrorModal()}
      {isLoading && (
        <>
          <div className={`${styles.contents} sp`}>
            <Skeleton variant="rectangular" height={160} />
            <Skeleton variant="circular" height={48} width={48} />
            <section className="inner">
              <Skeleton variant="text" width={120} />
            </section>
          </div>
        </>
      )}
      {!isLoading && (
        <>
          <div className={`${styles.contents}`}>
            <AvatarBackgroundImage
              imageUrl={iconUrl}
              avatarIconPosition="left"
              isNotUpload
              uploadIconSize="l"
            />
            <section className="inner">
              <Heading tag="h1" align="start" isBold size="xxl">
                {userName}
              </Heading>
              <span>{`友達 ${friendList.length}`}</span>
            </section>
            <div className={`${styles.buttonArea} inner`}>
              <Button
                color="primary"
                variant="contained"
                onClick={() => navigateRoom()}
                isFullWidth
                size={isPcWindow ? 'medium' : 'small'}
              >
                トーク
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default UsersOverview;
