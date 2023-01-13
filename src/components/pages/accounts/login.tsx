import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { FirebaseError } from 'firebase/app';

import styles from './login.module.css';

import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Heading';
import Input from '@/components/atoms/Input';
import Modal from '@/components/molecules/Modal';
import CoverImage from '@/components/organisms/CoverImage';
import Header from '@/components/organisms/Header';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { getFirebaseError } from '@/utils/firebaseErrorMessage';

import { useLogin } from '@/hooks';

const Login = () => {
  const [open, setOpen] = useState(false);
  const [firebaseError, setFirebaseError] = useState('');
  const navigate = useNavigate();

  const {
    signIn,
    email,
    setEmail,
    password,
    setPassword,
    passwordErrorMessage,
    setPasswordErrorMessage,
    passwordComplete,
    isComplete,
  } = useLogin();

  // コンポーネントに関係するものはコンポーネント
  // 機能に関するものはhooks、関係ないものはこっち
  const handleClick = async () => {
    if (!isComplete()) return;

    try {
      await signIn(email, password);
      navigate('/');
    } catch (error) {
      setOpen(true);
      if (error instanceof FirebaseError) {
        const errorCode = error.code;
        setFirebaseError(getFirebaseError(errorCode));
      }
    }
  };

  const errorModal = () => {
    if (!open) return;
    return (
      <Modal
        title="エラー"
        titleAlign="center"
        isOpen={open}
        hasInner
        isBold
        onClose={() => setOpen(false)}
      >
        <span className={styles.modalContent}>
          {firebaseError}
          <Button
            color="primary"
            variant="contained"
            onClick={() => setOpen(false)}
            className={styles.modalButton}
            isFullWidth
          >
            OK
          </Button>
        </span>
      </Modal>
    );
  };

  return (
    <>
      {errorModal()}
      <Header title="ログイン" className={`${styles.header} sp responsive`} />
      <div className={styles.container}>
        <CoverImage />
        <div className={`${styles.contents} inner`}>
          <Heading
            tag="h1"
            align="center"
            color="inherit"
            size="xxl"
            className={`${styles.responsiveTitle} pc responsive`}
          >
            ログイン
          </Heading>
          <div className={styles.emailForm}>
            <Input
              isFullWidth
              type="email"
              color="primary"
              variant="standard"
              id="emailLogin"
              label="メールアドレス"
              value={email}
              startIcon={<FontAwesomeIcon icon={faEnvelope} />}
              onChange={(event) => setEmail(event.target.value)}
              onBlur={() => setPasswordErrorMessage(passwordComplete())}
            />
          </div>
          <div className={styles.passwordForm}>
            <Input
              isFullWidth
              type="password"
              color="primary"
              variant="standard"
              id="passwordLogin"
              label="パスワード"
              value={password}
              errorMessage={passwordErrorMessage}
              startIcon={<FontAwesomeIcon icon={faLock} />}
              onChange={(event) => setPassword(event.target.value)}
              onBlur={() => setPasswordErrorMessage(passwordComplete())}
              minLength={10}
            />
          </div>
          <Button
            className={styles.forgotPasswordButton}
            color="primary"
            variant="text"
            onClick={() => navigate('/accounts/reset-password')}
          >
            パスワードを忘れた場合
          </Button>

          <Button
            className={styles.signInButton}
            color="primary"
            variant="contained"
            onClick={handleClick}
            isFullWidth
            isDisabled={!isComplete()}
          >
            サインイン
          </Button>
          <Button
            className={styles.createAccountButton}
            color="primary"
            variant="text"
            isFullWidth
            onClick={() => navigate('/accounts/create')}
          >
            アカウント作成
          </Button>
        </div>
      </div>
    </>
  );
};

export default Login;
