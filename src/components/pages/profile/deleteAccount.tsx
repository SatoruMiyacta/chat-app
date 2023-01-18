import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { FirebaseError } from 'firebase/app';
import { deleteUser } from 'firebase/auth';
import { useAtom } from 'jotai';

import styles from './deleteAccount.module.css';

import {
  faLock,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Heading';
import Input from '@/components/atoms/Input';
import Modal from '@/components/molecules/Modal';
import Header from '@/components/organisms/Header';

import { useDeleteAccount } from '@/hooks';
import { authUserAtom } from '@/store';
import { getFirebaseError } from '@/utils';

const DeleteAccount = () => {
  const [isModal, setIsModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [userData, setUserData] = useAtom(authUserAtom);

  const navigate = useNavigate();

  const {
    passwordComplete,
    setPasswordErrorMessage,
    passwordErrorMessage,
    setPassword,
    password,
    isComplete,
  } = useDeleteAccount();

  const handleClick = async () => {
    if (!isComplete()) return;

    try {
      if (!userData) return;
      await deleteUser(userData);
      setModalMessage('アカウントが削除されました。');
      setModalTitle('削除完了');
      setIsModal(true);
    } catch (error) {
      if (error instanceof FirebaseError) {
        const errorCode = error.code;
        setModalMessage(getFirebaseError(errorCode));
      }
      setModalTitle('エラー');
      setIsModal(true);
    }
  };

  const renderErrorModal = () => {
    if (!isModal) return;
    return (
      <Modal
        title={modalTitle}
        titleAlign="center"
        isOpen={isModal}
        hasInner
        isBoldTitle
        onClose={() => setIsModal(false)}
      >
        <div>
          <p>{modalMessage}</p>
        </div>
        <div className={styles.controler}>
          <Button
            color="primary"
            variant="contained"
            onClick={() => navigate('/')}
            className={styles.modalButton}
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
      {renderErrorModal()}
      <Header
        title="アカウント削除"
        className={`${styles.header} sp `}
        showBackButton
      />
      <main className={`${styles.container} inner`}>
        <Heading
          tag="h1"
          align="center"
          color="inherit"
          size="xxl"
          className={'pc'}
        >
          アカウント削除
        </Heading>
        <div className={styles.caution}>
          <FontAwesomeIcon
            icon={faTriangleExclamation}
            color="#ff971d"
            size="xl"
          />
          <p className={styles.alertMessage}>
            アカウント削除すると、すべてデータは消えてしまいます。
          </p>
        </div>
        <div className={styles.form}>
          <Input
            isFullWidth
            type="password"
            color="primary"
            variant={setVariant()}
            id="passwordDeleteAccount"
            label="パスワード"
            value={password}
            startIcon={<FontAwesomeIcon icon={faLock} />}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <div className={styles.fullWidthButton}>
          <Button
            color="primary"
            variant="contained"
            onClick={handleClick}
            isFullWidth
            isDisabled={!isComplete()}
          >
            削除する
          </Button>
        </div>
      </main>
    </>
  );
};

export default DeleteAccount;
