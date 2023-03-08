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
import CoverImageOnlyPc from '@/components/organisms/CoverImageOnlyPc';
import Header from '@/components/organisms/Header';

import { useLogin } from '@/features';
import { getFirebaseError, isValidPassword } from '@/utils';

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
        onClose={() => setIsErrorModalOpen(false)}
        title="エラー"
        titleAlign="center"
        hasInner
        isOpen={isErrorModalOpen}
        isBoldTitle
      >
        <div>
          <p>{firebaseErrorMessage}</p>
        </div>
        <div className={styles.controler}>
          <Button
            color="primary"
            onClick={() => setIsErrorModalOpen(false)}
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

  const isPcWindow = window.matchMedia('(min-width:1024px)').matches;
  return (
    <>
      {renderErrorModal()}
      <Header title="ログイン" className="sp" />
      <main className={isPcWindow ? 'flex' : ''}>
        <CoverImageOnlyPc />
        <div className={styles.container}>
          <section className={`${styles.contents} inner`}>
            <Heading
              tag="h1"
              align="center"
              color="inherit"
              className="pc"
              size="xxl"
            >
              ログイン
            </Heading>
            <div className={styles.form}>
              <Input
                color="primary"
                id="email"
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                value={email}
                variant={isPcWindow ? 'outlined' : 'standard'}
                isFullWidth
                isRequired
                label="メールアドレス"
                startIcon={<FontAwesomeIcon icon={faEnvelope} />}
              />
              <Input
                color="primary"
                id="password"
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                value={password}
                variant={isPcWindow ? 'outlined' : 'standard'}
                errorMessage={passwordErrorMessage}
                isFullWidth
                isRequired
                label="パスワード"
                minLength={10}
                startIcon={<FontAwesomeIcon icon={faLock} />}
                onBlur={() => {
                  if (!isValidPassword(password)) {
                    setPasswordErrorMessage('半角英数字で入力してください');
                  } else {
                    setPasswordErrorMessage('');
                  }
                }}
              />
              <Button
                color="primary"
                onClick={() => navigate('/accounts/reset-password')}
                variant="text"
              >
                パスワードを忘れた場合
              </Button>
            </div>

            <div className={styles.fullWidthButton}>
              <Button
                color="primary"
                onClick={signInAndRedirect}
                variant="contained"
                isDisabled={!isComplete()}
                isFullWidth
              >
                サインイン
              </Button>
              <Button
                color="primary"
                onClick={() => navigate('/accounts/create')}
                variant="text"
                isFullWidth
              >
                アカウント作成
              </Button>
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default Login;
