import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAtom } from 'jotai';

import styles from './editProfile.module.css';

import { faEnvelope, faIdCard } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Modal from '@/components/molecules/Modal';
import BaCkgroundImage from '@/components/organisms/BackgroundImage';
import Header, { ActionItem } from '@/components/organisms/Header';

import { useEditProfile } from '@/hooks';
import { authUserAtom } from '@/store';

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
    userIconFile,
    myIconUrl,
    userName,
    setName,
    email,
    setEmail,
    isComplete,
  } = useEditProfile();
  const navigate = useNavigate();

  const onSave = async () => {
    if (!isComplete) return;
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

  const setVariant = () => {
    if (window.matchMedia('(min-width:1024px)').matches) {
      return 'outlined';
    } else {
      return 'standard';
    }
  };

  return (
    <>
      {renderErrorModal}
      <Header title="プロフィール" actionItems={actionItems} showBackButton />
      <main className={styles.container}>
        <BaCkgroundImage
          hasCameraIcon
          // onChange={onFileload}
          iconUrl={myIconUrl}
          uploadIconButtonSize="small"
        />
        <div className={`${styles.contents} inner`}>
          <div className={styles.form}>
            <Input
              isFullWidth
              type="text"
              color="primary"
              variant={setVariant()}
              id="nameEditProfile"
              label="ユーザーネーム"
              value={userName}
              startIcon={<FontAwesomeIcon icon={faIdCard} />}
              onChange={(event) => setName(event.target.value)}
            />
            <Input
              isFullWidth
              type="email"
              color="primary"
              variant={setVariant()}
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
