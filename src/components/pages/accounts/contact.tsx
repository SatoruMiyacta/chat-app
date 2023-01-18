import { useState } from 'react';

import { FirebaseError } from 'firebase/app';

import styles from './contact.module.css';

import {
  faCircleQuestion,
  faEnvelope,
  faIdCard,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Heading';
import Input from '@/components/atoms/Input';
import Modal from '@/components/molecules/Modal';
import CoverImageOnlyPc from '@/components/organisms/CoverImageOnlyPc';
import Header from '@/components/organisms/Header';

import { useContact } from '@/hooks';
import { getFirebaseError, sendToSlack } from '@/utils';

const Contact = () => {
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState(
    '予期せぬエラーが発生しました。お手数ですが、再度送信してください。'
  );
  const [modalTitle, setModalTitle] = useState('');

  const {
    userName,
    setName,
    email,
    setEmail,
    contactText,
    setContactText,
    isComplete,
  } = useContact();

  const handleClick = async () => {
    if (!isComplete()) return;

    try {
      await sendToSlack(userName, email, contactText);
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
        title="お問い合わせ"
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
            お問い合わせ
          </Heading>
          <div className={styles.form}>
            <Input
              isFullWidth
              type="text"
              color="primary"
              variant="outlined"
              id="nameContact"
              label="ユーザーネーム"
              value={userName}
              startIcon={<FontAwesomeIcon icon={faIdCard} />}
              onChange={(event) => setName(event.target.value)}
              isRequired
            />
            <Input
              isFullWidth
              type="email"
              color="primary"
              variant="outlined"
              id="emailContact"
              label="メールアドレス"
              value={email}
              isRequired
              startIcon={<FontAwesomeIcon icon={faEnvelope} />}
              onChange={(event) => setEmail(event.target.value)}
            />
            <Input
              isFullWidth
              type="text"
              color="primary"
              variant="outlined"
              id="contact"
              label="お問い合わせ内容"
              value={contactText}
              startIcon={<FontAwesomeIcon icon={faCircleQuestion} />}
              onChange={(event) => setContactText(event.target.value)}
              rows={6}
              isMultiLines
              isRequired
              maxLength={300}
            />
          </div>
          <div className={styles.sendButton}>
            <Button
              color="primary"
              variant="contained"
              onClick={handleClick}
              isFullWidth
              isDisabled={!isComplete()}
            >
              送信
            </Button>
          </div>
        </section>
      </main>
    </>
  );
};

export default Contact;
