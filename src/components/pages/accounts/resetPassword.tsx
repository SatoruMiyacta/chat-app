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
import CoverImageOnlyPc from '@/components/organisms/CoverImageOnlyPc';
import Header from '@/components/organisms/Header';

import { useResetPassword } from '@/hooks';
import { auth } from '@/main';
import { getFirebaseError } from '@/utils';

const ResetPassword = () => {
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState(
    '予期せぬエラーが発生しました。お手数ですが、再度送信してください。'
  );
  const [modalTitle, setModalTitle] = useState('');
  const navigate = useNavigate();

  const { email, setEmail, isComplete } = useResetPassword();

  const handleClick = async () => {
    if (!isComplete()) return;

    try {
      await sendPasswordResetEmail(auth, email);
      setModalTitle('送信完了');
      setModalMessage('メールが送信されました。');
      setIsErrorModalOpen(true);
    } catch (error) {
      if (error instanceof FirebaseError) {
        const errorCode = error.code;
        setModalMessage(getFirebaseError(errorCode));
      }
      setModalTitle('エラー');
      setIsErrorModalOpen(true);
    }
  };

  const renderModal = () => {
    if (!isErrorModalOpen) return;

    return (
      <Modal
        title={modalTitle}
        titleAlign="center"
        isOpen={isErrorModalOpen}
        hasInner
        isBoldTitle
        onClose={() => setIsErrorModalOpen(false)}
      >
        <div>
          <p>{modalMessage}</p>
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
      {renderModal()}
      <Header
        title="パスワードリセット"
        className={`${styles.header} sp `}
        showBackButton
      />
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
            パスワードリセット
          </Heading>
          <p>
            パスワードをリセットします。登録したメールアドレスを入力して送信してください。
          </p>
          <div className={styles.form}>
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
          <div className={styles.fullWidthButton}>
            <Button
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
              color="inherit"
              variant="outlined"
              onClick={() => navigate('/accounts/contact')}
              isFullWidth
            >
              問い合わせ
            </Button>
          </div>
        </section>
      </main>
    </>
  );
};

export default ResetPassword;
