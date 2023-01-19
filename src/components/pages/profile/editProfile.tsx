import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { FirebaseError } from 'firebase/app';
import { updateEmail } from 'firebase/auth';
import { useSetAtom } from 'jotai';

import styles from './editProfile.module.css';

import { faEnvelope, faIdCard } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Modal from '@/components/molecules/Modal';
import BaCkgroundImage from '@/components/organisms/BackgroundImage';
import Header from '@/components/organisms/Header';

import {} from '@/hooks';
import { useEditProfile, InitialUserData } from '@/hooks';
import { auth } from '@/main';
import { UserData, usersAtom } from '@/store';
import {
  convertCanvasToBlob,
  resizeFile,
  validateBlobSize,
  getFirebaseError,
} from '@/utils';

const EditProfile = () => {
  const setUsers = useSetAtom(usersAtom);
  const [isErrorModal, setIsOpenErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    '予期せぬエラーが発生しました。お手数ですが、再度ログインしてください。'
  );

  const actionItems = [
    {
      item: '保存',
      onClick: () => onSave(),
    },
  ];

  const {
    setUserIconFile,
    getUserData,
    uploadIcon,
    updateUserDate,
    userIconFile,
    myIconUrl,
    userName,
    setUserName,
    setMyIconUrl,
    email,
    setEmail,
    isComplete,
    setInitialDate,
  } = useEditProfile();
  const navigate = useNavigate();

  useEffect(() => {
    setInitialDate();
  }, []);

  const onSave = async () => {
    if (!isComplete) return;

    try {
      if (!auth.currentUser) return;
      const useId = auth.currentUser.uid;

      await updateEmail(auth.currentUser, email);

      let userIconUrl = myIconUrl;
      if (userIconFile) userIconUrl = await uploadIcon(userIconFile, useId);

      const initialUserData: InitialUserData = { userName, userIconUrl };
      await updateUserDate(useId, initialUserData);

      const data = await getUserData(useId);
      if (!data) return;

      const date = new Date();
      const userData: UserData = {
        name: data.name,
        iconUrl: data.iconUrl,
        createdAt: data.createdAt,
        updateAt: data.updateAt,
      };
      setUsers({ [useId]: { data: userData, expiresIn: date } });

      navigate('/profile');
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

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const canvas = await resizeFile(event);
      if (!canvas) {
        throw new Error(
          '画像が読み込めません。お手数ですが、再度アップロードしてください。'
        );
      }

      const blobFile = await convertCanvasToBlob(canvas);

      const blob = validateBlobSize(blobFile);

      setUserIconFile(blob);
      setMyIconUrl(URL.createObjectURL(blob));
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      }

      setIsOpenErrorModal(true);
    }
  };

  const renderErrorModal = () => {
    if (!isErrorModal) return;

    return (
      <Modal
        title="エラー"
        titleAlign="center"
        isOpen={isErrorModal}
        hasInner
        isBoldTitle
        onClose={() => setIsOpenErrorModal(false)}
      >
        <div>
          <p>{errorMessage}</p>
        </div>
        <div className={styles.controler}>
          <Button
            color="primary"
            variant="contained"
            onClick={() => setIsOpenErrorModal(false)}
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
      {renderErrorModal}
      <Header
        title="プロフィール編集"
        actionItems={actionItems}
        showBackButton
      />
      <main className={styles.container}>
        <div className={`${styles.iconImage} ${isPcWindow ? 'inner' : ''}`}>
          <BaCkgroundImage
            hasCameraIcon
            onChange={onFileChange}
            iconUrl={myIconUrl}
            uploadIconButtonSize={isPcWindow ? 'medium' : 'small'}
          />
        </div>
        <div className={`${styles.contents} inner`}>
          <div className={styles.form}>
            <Input
              isFullWidth
              type="text"
              color="primary"
              variant={isPcWindow ? 'outlined' : 'standard'}
              id="nameEditProfile"
              label="ユーザーネーム"
              value={userName}
              startIcon={<FontAwesomeIcon icon={faIdCard} />}
              onChange={(event) => setUserName(event.target.value)}
            />
            <Input
              isFullWidth
              type="email"
              color="primary"
              variant={isPcWindow ? 'outlined' : 'standard'}
              id="email"
              label="メールアドレス"
              value={email}
              startIcon={<FontAwesomeIcon icon={faEnvelope} />}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className={styles.buttonArea}>
            <Button
              color="danger"
              variant="outlined"
              onClick={() => navigate('/profile/delete-account')}
              isFullWidth
              className={styles.deleteButton}
            >
              アカウント削除
            </Button>
          </div>
        </div>
      </main>
    </>
  );
};

export default EditProfile;
