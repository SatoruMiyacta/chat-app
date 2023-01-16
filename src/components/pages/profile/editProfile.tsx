import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { FirebaseError } from 'firebase/app';
import { useAtom } from 'jotai';

import styles from './editProfile.module.css';

import { faEnvelope, faIdCard } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Modal from '@/components/molecules/Modal';
import BaCkgroundImage from '@/components/organisms/BackgroundImage';
import Header, { ActionItem } from '@/components/organisms/Header';

import { INITIAL_ICON_URL } from '@/constants';
import { useEditProfile } from '@/hooks';
import { authUserAtom } from '@/store';
import { getFirebaseError } from '@/utils';

const EditProfile = () => {
  const [userData, setUserData] = useAtom(authUserAtom);
  const [isErrorModal, setIsErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    '予期せぬエラーが発生しました。お手数ですが、再度ログインしてください。'
  );

  const [actionItems, setActionItems] = useState<ActionItem[]>([
    {
      item: '保存',
      onClick: (event) => onSave(),
    },
  ]);

  const {
    onFileload,
    getMyUserData,
    uploadIcon,
    userIconFile,
    myIconUrl,
    name,
    setName,
    email,
    setEmail,
    nameErrorMessage,
    isComplete,
    nameComplete,
    setNameErrorMessage,
    saveUserData,
  } = useEditProfile();
  const navigate = useNavigate();

  const onSave = async () => {
    if (!isComplete) return;
    try {
      if (!userData) return;
      const userUid = userData.uid;
      let userIconUrl = INITIAL_ICON_URL;
      if (userIconFile) userIconUrl = await uploadIcon(userIconFile, userUid);
      await saveUserData(userUid, userIconUrl, name, email);
      navigate('/profile');
    } catch (error) {
      setIsErrorModal(true);
      if (error instanceof FirebaseError) {
        const errorCode = error.code;
        setErrorMessage(getFirebaseError(errorCode));
      }
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
        onClose={() => setIsErrorModal(false)}
      >
        <div>
          <p>{errorMessage}</p>
        </div>
        <div className={styles.controler}>
          <Button
            color="primary"
            variant="contained"
            onClick={() => setIsErrorModal(false)}
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
      {renderErrorModal}
      <Header title="プロフィール" actionItems={actionItems} showBackButton />
      <main>
        <BaCkgroundImage
          hasCameraIcon
          onChange={onFileload}
          iconUrl={myIconUrl}
        />
        <div className={`${styles.contents} inner`}>
          <div className={styles.form}>
            <Input
              isFullWidth
              type="text"
              color="primary"
              variant="standard"
              id="nameEditProfile"
              label="ユーザーネーム"
              value={name}
              errorMessage={nameErrorMessage}
              startIcon={<FontAwesomeIcon icon={faIdCard} />}
              onChange={(event) => setName(event.target.value)}
              onBlur={() => setNameErrorMessage(nameComplete())}
            />
            <Input
              isFullWidth
              type="email"
              color="primary"
              variant="standard"
              id="email"
              label="メールアドレス"
              value={email}
              startIcon={<FontAwesomeIcon icon={faEnvelope} />}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className={styles.fullWidthButton}>
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
