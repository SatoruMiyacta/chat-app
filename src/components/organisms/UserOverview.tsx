import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { FirebaseError } from 'firebase/app';
import { useAtom } from 'jotai';

import styles from './UserOverview.module.css';

import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Heading';
import Skeleton from '@/components/atoms/Skeleton';
import Modal from '@/components/molecules/Modal';
import AvatarBackgroundImage from '@/components/organisms/AvatarBackgroundImage';

import { useUser, useFriend } from '@/hooks';
import { authUserAtom } from '@/store';
import { getFirebaseError, searchRoomId } from '@/utils';

export interface UserProps {
  userId: string;
}

const UsersOverview = ({ userId }: UserProps) => {
  const [authUser] = useAtom(authUserAtom);
  const [userName, setUserName] = useState('');
  const [iconUrl, setIconUrl] = useState('');
  const [isOpenErrorModal, setIsOpenErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    '予期せぬエラーが発生しました。お手数ですが、再度ログインしてください。'
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isFriend, setIsFriend] = useState(false);
  const [friendList, setFriendList] = useState<string[]>([]);
  const navigate = useNavigate();
  const { getMyFriendIdList, addUserToFriend } = useFriend();
  const { getUser, saveUser, getSearchedFriends } = useUser();

  const authUserId = authUser?.uid;

  useEffect(() => {
    if (!userId) return;
    if (!authUserId) return;

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

      const searchList = [];
      searchList.push(userId);

      getSearchedFriends(searchList, authUserId).then(
        (searchedFriendsIdList) => {
          if (searchedFriendsIdList && searchedFriendsIdList.length !== 0) {
            setIsFriend(true);
          }
        }
      );

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
  }, [authUserId, userId]);

  const navigateRoom = async () => {
    if (!authUserId) return;

    const roomId = await searchRoomId(authUserId, userId);
    navigate(`/rooms/${roomId}/message`);
  };

  const addFriend = async () => {
    if (!authUserId) return;

    try {
      await addUserToFriend(authUserId, userId);
      navigate(`/search`);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else if (error instanceof FirebaseError) {
        const errorCode = error.code;
        setErrorMessage(getFirebaseError(errorCode));
      }
    }
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
            {isFriend && (
              <div className={`${styles.buttonArea} inner`}>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => navigateRoom()}
                  isFullWidth
                  size="medium"
                >
                  トーク
                </Button>
              </div>
            )}
            {!isFriend && (
              <div className={`${styles.buttonArea} inner`}>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => addFriend()}
                  isFullWidth
                  size="medium"
                >
                  友達追加
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default UsersOverview;
