import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { FirebaseError } from 'firebase/app';
import { deleteUser } from 'firebase/auth';
import { deleteDoc, doc } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import { useAtomValue } from 'jotai';

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
import { auth, db, storage } from '@/main';
import { authUserAtom } from '@/store';
import { getFirebaseError, isValidPassword } from '@/utils';

const DeleteAccount = () => {
  const [isModal, setIsModal] = useState(false);
  const [modalMessage, setModalMessage] = useState(
    '予期せぬエラーが発生しました。お手数ですが、再度実行してください。'
  );
  const [modalTitle, setModalTitle] = useState('');
  const userData = useAtomValue(authUserAtom);

  const navigate = useNavigate();

  const {
    setPasswordErrorMessage,
    passwordErrorMessage,
    setPassword,
    password,
    isComplete,
  } = useDeleteAccount();

  const deleteAccount = async () => {
    if (!isComplete()) return;

    try {
      if (!userData) return;

      if (!auth.currentUser) return;
      const uid = auth.currentUser.uid;
      await deleteDoc(doc(db, 'users', uid));

      const desertRef = ref(storage, `iconImage/${uid}/userIcon`);
      await deleteObject(desertRef);

      await deleteUser(userData);

      // setModalMessage('アカウントが削除されました。');
      // setModalTitle('削除完了');
      // setIsModal(true);
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
          <p>アカウント削除すると、すべてデータは消えてしまいます。</p>
        </div>
        <div className={styles.contents}>
          <div className={styles.form}>
            <Input
              isFullWidth
              type="password"
              color="primary"
              variant={isPcWindow ? 'outlined' : 'standard'}
              label="パスワード"
              id="pass_delete"
              value={password}
              errorMessage={passwordErrorMessage}
              startIcon={<FontAwesomeIcon icon={faLock} />}
              onChange={(event) => setPassword(event.target.value)}
              onBlur={() => {
                if (!isValidPassword(password)) {
                  setPasswordErrorMessage('半角英数字で入力してください');
                } else {
                  setPasswordErrorMessage('');
                }
              }}
              minLength={10}
            />
          </div>
          <div className={styles.buttonArea}>
            <Button
              color="primary"
              variant="contained"
              onClick={deleteAccount}
              isFullWidth
              isDisabled={!isComplete()}
            >
              削除する
            </Button>
          </div>
        </div>
      </main>
    </>
  );
};

export default DeleteAccount;
