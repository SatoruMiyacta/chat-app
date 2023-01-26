import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { FirebaseError } from 'firebase/app';
import { updateEmail } from 'firebase/auth';
import { useSetAtom } from 'jotai';

import styles from './editProfile.module.css';

import {
  faEnvelope,
  faIdCard,
  faLock,
} from '@fortawesome/free-solid-svg-icons';
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
  isValidPassword,
} from '@/utils';

const EditProfile = () => {
  const setUsers = useSetAtom(usersAtom);
  const [isModal, setIsModal] = useState(false);
  const [isPasswordAuthModal, setIsPasswordAuthModal] = useState(false);
  const [modalMessage, setModalMessage] = useState(
    '予期せぬエラーが発生しました。お手数ですが、再度ログインしてください。'
  );
  const [modalTitle, setModalTitle] = useState('エラー');
  const navigate = useNavigate();

  const actionItems = [
    {
      item: '保存',
      onClick: () => onSave(),
    },
  ];

  const {
    setUserIconFile,
    reAuthenticate,
    getUserData,
    updateUserDate,
    userIconFile,
    myIconUrl,
    userName,
    setUserName,
    setMyIconUrl,
    email,
    setEmail,
    isComplete,
    uploadIcon,
    setInitialDate,
    setPasswordErrorMessage,
    setPassword,
    passwordErrorMessage,
    password,
  } = useEditProfile();

  useEffect(() => {
    setInitialDate(userName, myIconUrl);
  }, []);

  const onSave = async () => {
    if (!isComplete) return;

    try {
      if (!auth.currentUser) return;
      const useId = auth.currentUser.uid;

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
        updatedAt: data.updatedAt,
      };
      setUsers((preveState) => ({
        ...preveState,
        [useId]: { data: userData, expiresIn: date },
      }));

      if (email !== auth.currentUser.email) {
        setIsPasswordAuthModal(true);
        console.log('email');
      } else {
        setModalTitle('完了');
        setModalMessage('保存されました');
        setIsModal(true);
      }
    } catch (error) {
      if (error instanceof Error) {
        setModalMessage(error.message);
      } else if (error instanceof FirebaseError) {
        const errorCode = error.code;
        setModalMessage(getFirebaseError(errorCode));
      }

      setIsModal(true);
    }
  };

  const authenticatePassword = async () => {
    try {
      if (!auth.currentUser) return;

      if (!isValidPassword) return;

      await reAuthenticate();
      await updateEmail(auth.currentUser, email);
      navigate('/profile');
    } catch (error) {
      setIsPasswordAuthModal(false);
      if (error instanceof FirebaseError) {
        const errorCode = error.code;
        setModalMessage(getFirebaseError(errorCode));
      } else if (error instanceof Error) {
        setModalMessage(error.message);
      }

      setIsModal(true);
    }
  };

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files) return;
      const file = event.target.files[0];
      const canvas = await resizeFile(file);

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
        setModalMessage(error.message);
      }

      setIsModal(true);
    }
  };

  const renderModal = () => {
    if (!isModal) return;

    return (
      <Modal
        onClose={() => setIsModal(false)}
        title={modalTitle}
        titleAlign="center"
        hasInner
        isOpen={isModal}
        isBoldTitle
      >
        <div>
          <p>{modalMessage}</p>
        </div>
        <div className={styles.controler}>
          <Button
            color="primary"
            onClick={() => {
              setIsModal(false);
              navigate('/profile');
            }}
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

  const renderPasswordAuthModal = () => {
    if (!isPasswordAuthModal) return;

    return (
      <Modal
        onClose={() => setIsPasswordAuthModal(false)}
        title="パスワード認証"
        titleAlign="center"
        hasInner
        isOpen={isPasswordAuthModal}
        isBoldTitle
      >
        <div className={styles.form}>
          <Input
            color="primary"
            id="passwordEdit"
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            value={password}
            variant="outlined"
            errorMessage={passwordErrorMessage}
            isFullWidth
            minLength={10}
            onBlur={() => {
              if (!isValidPassword(password)) {
                setPasswordErrorMessage('半角英数字で入力してください');
              } else {
                setPasswordErrorMessage('');
              }
            }}
            placeholder="パスワード"
            startIcon={<FontAwesomeIcon icon={faLock} />}
          />
        </div>
        <div className={styles.controler}>
          <Button
            color="primary"
            onClick={authenticatePassword}
            variant="contained"
            isDisabled={!isValidPassword(password)}
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
      {renderModal()}
      {renderPasswordAuthModal()}
      <Header
        title="プロフィール編集"
        actionItems={actionItems}
        className="sp"
        showBackButton
      />
      <main className={styles.container}>
        <div className={`${styles.iconImage} ${isPcWindow ? 'inner' : ''}`}>
          <BaCkgroundImage
            onChange={onFileChange}
            hasCameraIcon
            hasBackgroundImage={!isPcWindow}
            iconUrl={myIconUrl}
            uploadIconButtonSize={isPcWindow ? 'medium' : 'small'}
          />
        </div>
        <div className={`${styles.contents} inner`}>
          <div className={styles.form}>
            <Input
              color="primary"
              id="nameEditProfile"
              onChange={(event) => setUserName(event.target.value)}
              type="text"
              value={userName}
              variant={isPcWindow ? 'outlined' : 'standard'}
              isFullWidth
              label="ユーザーネーム"
              startIcon={<FontAwesomeIcon icon={faIdCard} />}
            />
            <Input
              color="primary"
              id="email"
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              value={email}
              variant={isPcWindow ? 'outlined' : 'standard'}
              isFullWidth
              label="メールアドレス"
              startIcon={<FontAwesomeIcon icon={faEnvelope} />}
            />
          </div>
          <div className={styles.buttonArea}>
            <Button
              color="danger"
              onClick={() => navigate('/profile/delete-account')}
              variant="outlined"
              className={styles.deleteButton}
              isFullWidth
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
