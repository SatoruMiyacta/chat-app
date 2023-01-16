import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { FirebaseError } from 'firebase/app';

import styles from './login.module.css';

import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Heading';
import Input from '@/components/atoms/Input';
import Modal from '@/components/molecules/Modal';
import Header from '@/components/organisms/Header';

import { getFirebaseError, isValidPassword } from '@/utils';

import CoverImageOnlyPc from '@/components/organisms/CoverImageOnlyPc';
import { useLogin } from '@/hooks';

const Login = () => {
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [firebaseErrorMessage, setFirebaseErrorMessage] = useState(
    '予期せぬエラーが発生しました。お手数ですが、再度ログインしてください。'
  );
  const navigate = useNavigate();

  const {
    signIn,
    email,
    setEmail,
    password,
    setPassword,
    passwordErrorMessage,
    setPasswordErrorMessage,
    isComplete,
  } = useLogin();

  // コンポーネントに関係するものはコンポーネント
  // 機能に関するものはhooks、関係ないものはこっち
  const signInAndRedirect = async () => {
    if (!isComplete()) return;

    try {
      await signIn(email, password);
      navigate('/');
    } catch (error) {
      if (error instanceof FirebaseError) {
        const errorCode = error.code;
        setFirebaseErrorMessage(getFirebaseError(errorCode));
      }
      setIsErrorModalOpen(true);
    }
  };

  const renderErrorModal = () => {
    if (!isErrorModalOpen) return;

    return (
      <Modal
        title="エラー"
        titleAlign="center"
        isOpen={isErrorModalOpen}
        hasInner
        isBoldTitle
        onClose={() => setIsErrorModalOpen(false)}
      >
        <div>
          <p>{firebaseErrorMessage}</p>
        </div>
        <div className={styles.controler}>
          <Button
            color="primary"
            variant="contained"
            onClick={() => setIsErrorModalOpen(false)}
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
      <Header title="ログイン" className={`${styles.header} sp`} />
      <main className={styles.container}>
        <CoverImageOnlyPc />
        <section className={`${styles.contents} inner`}>
          <Heading
            tag="h1"
            align="center"
            color="inherit"
            size="xxl"
            className={'pc'}
          >
            ログイン
          </Heading>
          <div className={styles.form}>
            <Input
              isFullWidth
              type="email"
              color="primary"
              variant="standard"
              id="emailLogin"
              label="メールアドレス"
              value={email}
              isRequired
              startIcon={<FontAwesomeIcon icon={faEnvelope} />}
              onChange={(event) => setEmail(event.target.value)}
            />
            <Input
              isFullWidth
              type="password"
              color="primary"
              variant="standard"
              id="passwordLogin"
              label="パスワード"
              value={password}
              isRequired
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
            <Button
              color="primary"
              variant="text"
              onClick={() => navigate('/accounts/reset-password')}
            >
              パスワードを忘れた場合
            </Button>
          </div>
          <div className={styles.fullWidthButton}>
            <Button
              color="primary"
              variant="contained"
              onClick={signInAndRedirect}
              isFullWidth
              isDisabled={!isComplete()}
            >
              サインイン
            </Button>
            <Button
              color="primary"
              variant="text"
              isFullWidth
              onClick={() => navigate('/accounts/create')}
            >
              アカウント作成
            </Button>
          </div>
        </section>
      </main>
    </>
  );
};

export default Login;
