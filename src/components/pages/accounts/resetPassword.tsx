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
  const [isOpenErrorModal, setIsOpenErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState(
    '予期せぬエラーが発生しました。お手数ですが、再度送信してください。'
  );
  const [modalTitle, setModalTitle] = useState('');
  const navigate = useNavigate();

  const { email, setEmail, isComplete } = useResetPassword();

  const resetPassword = async () => {
    if (!isComplete()) return;

    try {
      await sendPasswordResetEmail(auth, email);

      setModalTitle('送信完了');
      setModalMessage(
        'パスワードリセットメールが送信されました。入力したメールアドレスより、パスワードを再設定してください。'
      );
      setIsOpenErrorModal(true);
    } catch (error) {
      if (error instanceof FirebaseError) {
        const errorCode = error.code;
        setModalMessage(getFirebaseError(errorCode));
      }

      setModalTitle('エラー');
      setIsOpenErrorModal(true);
    }
  };

  const renderModal = () => {
    if (!isOpenErrorModal) return;

    return (
      <Modal
        onClose={() => setIsOpenErrorModal(false)}
        title={modalTitle}
        titleAlign="center"
        hasInner
        isOpen={isOpenErrorModal}
        isBoldTitle
      >
        <div>
          <p>{modalMessage}</p>
        </div>
        <div className={styles.controler}>
          <Button
            color="primary"
            onClick={() => setIsOpenErrorModal(false)}
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
      {renderModal()}
      <Header title="パスワードリセット" className="sp" showBackButton />
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
              パスワードリセット
            </Heading>
            <div className={styles.formArea}>
              <p>
                パスワードをリセットします。登録したメールアドレスを入力して送信してください。
              </p>
              <Input
                color="primary"
                id="email"
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                value={email}
                variant={isPcWindow ? 'outlined' : 'standard'}
                isFullWidth
                label="メールアドレス"
                startIcon={<FontAwesomeIcon icon={faEnvelope} />}
              />
              <Button
                color="primary"
                onClick={resetPassword}
                variant="contained"
                isDisabled={!isComplete()}
                isFullWidth
              >
                メール送信
              </Button>
            </div>
            <hr />
            <div className={styles.buttonArea}>
              <Button
                color="inherit"
                onClick={() => navigate('/accounts/contact')}
                variant="outlined"
                isFullWidth
              >
                問い合わせ
              </Button>
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default ResetPassword;
