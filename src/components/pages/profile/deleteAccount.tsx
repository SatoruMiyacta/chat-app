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

import { getFirebaseError } from '@/utils/firebaseErrorMessage';

import { useDeleteAccount } from '@/hooks/useDeleteAccount';
import { authUserAtom } from '@/store';

const DeleteAccount = () => {
  const [open, setOpen] = useState(false);
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
      setOpen(true);
    } catch (error) {
      if (error instanceof FirebaseError) {
        const errorCode = error.code;
        setModalMessage(getFirebaseError(errorCode));
      }
      setModalTitle('エラー');
      setOpen(true);
    }
  };

  const completeDelete = () => {
    if (!open) return;
    return (
      <Modal
        title={modalTitle}
        titleAlign="center"
        isOpen={open}
        hasInner
        isBold
        onClose={() => setOpen(false)}
      >
        <span className={styles.modalContent}>
          {modalMessage}
          <Button
            color="primary"
            variant="contained"
            onClick={() => navigate('/')}
            className={styles.modalButton}
          >
            OK
          </Button>
        </span>
      </Modal>
    );
  };

  return (
    <>
      {completeDelete()}
      <Header
        title="アカウント削除"
        className={`${styles.header} sp responsive`}
        showBackButton
      />
      <div className={`${styles.contents} inner`}>
        <Heading
          tag="h1"
          align="center"
          color="inherit"
          size="xxl"
          className={`${styles.responsiveTitle} pc responsive`}
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
        <div className={styles.passwordForm}>
          <Input
            isFullWidth
            type="password"
            color="primary"
            variant="standard"
            id="passwordDeleteAccount"
            label="パスワード"
            value={password}
            startIcon={<FontAwesomeIcon icon={faLock} />}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <Button
          className={styles.deleteButton}
          color="primary"
          variant="contained"
          onClick={handleClick}
          isFullWidth
          isDisabled={!isComplete()}
        >
          削除する
        </Button>
      </div>
    </>
  );
};

export default DeleteAccount;
