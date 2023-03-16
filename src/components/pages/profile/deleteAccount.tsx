import { useState, useEffect } from 'react';

import { FirebaseError } from 'firebase/app';
import { deleteUser } from 'firebase/auth';
import { deleteDoc, doc } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
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
import Progress from '@/components/atoms/Progress';
import Modal from '@/components/molecules/Modal';
import Header from '@/components/organisms/Header';

import { useDeleteAccount } from '@/features';
import { useUser, useAuth } from '@/hooks';
import { auth, db, storage } from '@/main';
import { authUserAtom } from '@/store';
import { getFirebaseError, isValidPassword } from '@/utils';

const DeleteAccount = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenErrorModal, setIsOpenErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState(
    '予期せぬエラーが発生しました。お手数ですが、再度実行してください。'
  );
  const [modalTitle, setModalTitle] = useState('');
  const [authUser] = useAtom(authUserAtom);

  const {
    setPasswordErrorMessage,
    passwordErrorMessage,
    setPassword,
    password,
    isComplete,
    reAuthenticate,
    isPasswordComplete,
    setIsPasswordComplete,
  } = useDeleteAccount();

  const { getUser } = useUser();

  const { resetCache } = useAuth();

  const deleteAccount = async () => {
    if (!isComplete()) return;
    if (isLoading) return;

    try {
      if (!authUser) return;

      if (!auth.currentUser) return;

      setIsLoading(true);

      await reAuthenticate();

      const uid = auth.currentUser.uid;
      const userData = await getUser(uid);

      if (userData?.iconUrl !== '/images/user-solid.svg') {
        const desertRef = ref(storage, `iconImage/users/${uid}/userIcon`);
        if (desertRef) await deleteObject(desertRef);
      }

      await deleteDoc(doc(db, 'users', uid));

      await deleteUser(authUser);

      resetCache();

      setIsLoading(false);
      alert('アカウント削除完了しました');
    } catch (error) {
      if (error instanceof FirebaseError) {
        const errorCode = error.code;
        setModalMessage(getFirebaseError(errorCode));
      }
      setModalTitle('エラー');
      setIsOpenErrorModal(true);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const isPassword = isComplete();

    setIsPasswordComplete(isPassword);
  }, [password.length]);

  const renderErrorModal = () => {
    if (!isOpenErrorModal) return;
    return (
      <Modal
        onClose={() => setIsOpenErrorModal(false)}
        title={modalTitle}
        titleAlign="center"
        hasInner
        isBoldTitle
        isOpen={isOpenErrorModal}
      >
        <div>
          <p>{modalMessage}</p>
        </div>
        <div className={styles.controler}>
          <Button
            color="primary"
            onClick={() => {
              setIsLoading(false);
              setIsOpenErrorModal(false);
            }}
            variant="contained"
            isFullWidth
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
                minLength={8}
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
                isDisabled={!isPasswordComplete}
                isFullWidth
              >
                {isLoading && <Progress color="inherit" size={24} />}
                {!isLoading && '削除する'}
              </Button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default DeleteAccount;
