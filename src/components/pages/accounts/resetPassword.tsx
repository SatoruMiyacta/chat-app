import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { FirebaseError } from 'firebase/app';
import { sendPasswordResetEmail } from 'firebase/auth';

import styles from './resetPassword.module.css';

import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Heading';
import Input from '@/components/atoms/Input';
import Modal from '@/components/molecules/Modal';
import CoverImage from '@/components/organisms/CoverImage';
import Header from '@/components/organisms/Header';

import { getFirebaseError } from '@/utils/firebaseErrorMessage';

import { useResetPassword } from '@/hooks/useResetPassword';
import { auth } from '@/main';

const ResetPassword = () => {
  const [open, setOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const { email, setEmail, isComplete } = useResetPassword();
  const navigate = useNavigate();

  const handleClick = async () => {
    if (!isComplete()) return;

    try {
      await sendPasswordResetEmail(auth, email);
      setModalMessage('メールが送信されました。');
      setModalTitle('送信完了');
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

  const completeSendEmail = () => {
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
            onClick={() => setOpen(false)}
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
      {completeSendEmail()}
      <Header
        title="パスワードリセット"
        className={`${styles.header} sp responsive`}
        showBackButton
      />
      <div className={styles.container}>
        <CoverImage />
        <div className={styles.inner}>
          <Heading
            tag="h1"
            align="center"
            color="inherit"
            size="xxl"
            className={`${styles.responsiveTitle} pc responsive`}
          >
            パスワードリセット
          </Heading>
          <p className={styles.resetMessage}>
            パスワードをリセットします。登録したメールアドレスを入力して送信してください。
          </p>
          <div className={styles.emailForm}>
            <Input
              isFullWidth
              type="email"
              color="primary"
              variant="standard"
              id="emailResetPassword"
              label="メールアドレス"
              value={email}
              startIcon={<FontAwesomeIcon icon={faEnvelope} />}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <Button
            className={styles.forgotPasswordButton}
            color="primary"
            variant="contained"
            onClick={handleClick}
            isFullWidth
            isDisabled={!isComplete()}
          >
            メール送信
          </Button>
          <hr />
          <Button
            className={styles.contactButton}
            color="inherit"
            variant="outlined"
            onClick={() => navigate('/accounts/contact')}
            isFullWidth
          >
            問い合わせ
          </Button>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
