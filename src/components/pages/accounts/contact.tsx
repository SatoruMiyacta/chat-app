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
import CoverImage from '@/components/organisms/CoverImage';
import Header from '@/components/organisms/Header';

import { fetchSlackApi } from '@/utils/fetchSlackApi';
import { getFirebaseError } from '@/utils/firebaseErrorMessage';

import { useContact } from '@/hooks/useContact';

const Contact = () => {
  const [open, setOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');

  const {
    name,
    setName,
    email,
    setEmail,
    contactText,
    setContactText,
    nameErrorMessage,
    setNameErrorMessage,
    contactTextErrorMessage,
    setContactTextErrorMessage,
    nameComplete,
    isComplete,
    contactTextComplete,
  } = useContact();

  const handleClick = async () => {
    if (!isComplete()) return;

    try {
      fetchSlackApi(name, email, contactText);
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

  const showModal = () => {
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
      {showModal()}
      <Header
        title="お問い合わせ"
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
            お問い合わせ
          </Heading>
          <div className={styles.formWrapper}>
            <div className={styles.userForm}>
              <Input
                isFullWidth
                type="text"
                color="primary"
                variant="outlined"
                id="nameContact"
                label="ユーザーネーム"
                value={name}
                errorMessage={nameErrorMessage}
                startIcon={<FontAwesomeIcon icon={faIdCard} />}
                onChange={(event) => setName(event.target.value)}
                onBlur={() => setNameErrorMessage(nameComplete())}
              />
            </div>
            <div className={styles.emailForm}>
              <Input
                isFullWidth
                type="email"
                color="primary"
                variant="outlined"
                id="emailContact"
                label="メールアドレス"
                value={email}
                startIcon={<FontAwesomeIcon icon={faEnvelope} />}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <div className={styles.contactForm}>
              <Input
                isFullWidth
                type="text"
                color="primary"
                variant="outlined"
                id="contact"
                label="お問い合わせ内容"
                value={contactText}
                errorMessage={contactTextErrorMessage}
                startIcon={<FontAwesomeIcon icon={faCircleQuestion} />}
                onChange={(event) => setContactText(event.target.value)}
                onBlur={() => setContactTextErrorMessage(contactTextComplete())}
                rows={4}
                isMultiLines
                maxLength={300}
              />
            </div>
            <Button
              className={styles.createButton}
              color="primary"
              variant="contained"
              onClick={handleClick}
              isFullWidth
              isDisabled={!isComplete()}
            >
              送信
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
