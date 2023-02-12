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

import { useDeleteAccount } from '@/features';
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
        onClose={() => setIsModal(false)}
        title={modalTitle}
        titleAlign="center"
        hasInner
        isBoldTitle
        isOpen={isModal}
      >
        <div>
          <p>{modalMessage}</p>
        </div>
        <div className={styles.controler}>
          <Button
            color="primary"
            onClick={() => navigate('/')}
            variant="contained"
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
      <Header title="アカウント削除" className="sp" showBackButton />
      <main className={`${styles.container} inner grow`}>
        <section>
          <Heading
            tag="h1"
            align="start"
            className="pc"
            color="inherit"
            size="xxl"
          >
            アカウント削除
          </Heading>
          <div className={`${styles.caution} flex alic fdrc`}>
            <FontAwesomeIcon
              color="#ff971d"
              icon={faTriangleExclamation}
              size="xl"
            />
            <p>アカウント削除すると、すべてデータは消えてしまいます。</p>
          </div>
          <div className={styles.contents}>
            <div className={styles.form}>
              <Input
                color="primary"
                id="pass_delete"
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                value={password}
                variant={isPcWindow ? 'outlined' : 'standard'}
                errorMessage={passwordErrorMessage}
                isFullWidth
                label="パスワード"
                minLength={10}
                onBlur={() => {
                  if (!isValidPassword(password)) {
                    setPasswordErrorMessage('半角英数字で入力してください');
                  } else {
                    setPasswordErrorMessage('');
                  }
                }}
                startIcon={<FontAwesomeIcon icon={faLock} />}
              />
            </div>
            <div className={styles.buttonArea}>
              <Button
                color="primary"
                onClick={deleteAccount}
                variant="contained"
                isDisabled={!isComplete()}
                isFullWidth
              >
                削除する
              </Button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default DeleteAccount;
