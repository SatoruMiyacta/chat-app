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

import { useContact } from '@/features';
import { getFirebaseError, sendToSlack } from '@/utils';

const Contact = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [modalMessage, setModalMessage] = useState(
    '予期せぬエラーが発生しました。お手数ですが、再度送信してください。'
  );
  const [modalTitle, setModalTitle] = useState('');

  const {
    userName,
    setUserName,
    email,
    setEmail,
    contactText,
    setContactText,
    isComplete,
  } = useContact();

  const contact = async () => {
    if (!isComplete()) return;

    try {
      await sendToSlack(userName, email, contactText);

      setModalTitle('送信完了');
      setModalMessage(
        'お問い合わせを受けつけました。返信が必要な場合は7日以内にご連絡いたします。'
      );
      setIsOpenModal(true);
    } catch (error) {
      if (error instanceof FirebaseError) {
        const errorCode = error.code;
        setModalMessage(getFirebaseError(errorCode));
      }

      setModalTitle('エラー');
      setIsOpenModal(true);
    }
  };

  const renderModal = () => {
    if (!isOpenModal) return;

    return (
      <Modal
        onClose={() => setIsOpenModal(false)}
        title={modalTitle}
        titleAlign="center"
        hasInner
        isOpen={isOpenModal}
        isBoldTitle
      >
        <div>
          <p>{modalMessage}</p>
        </div>
        <div className={styles.controler}>
          <Button
            color="primary"
            onClick={() => setIsOpenModal(false)}
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
      <Header title="お問い合わせ" className="sp" showBackButton />
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
              お問い合わせ
            </Heading>
            <div className={styles.form}>
              <Input
                color="primary"
                id="name"
                onChange={(event) => setUserName(event.target.value)}
                type="text"
                value={userName}
                variant="outlined"
                isFullWidth
                isRequired
                label="ユーザーネーム"
                startIcon={<FontAwesomeIcon icon={faIdCard} />}
              />
              <Input
                color="primary"
                id="email"
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                value={email}
                variant="outlined"
                isFullWidth
                isRequired
                label="メールアドレス"
                startIcon={<FontAwesomeIcon icon={faEnvelope} />}
              />
              <Input
                color="primary"
                id="contact"
                onChange={(event) => setContactText(event.target.value)}
                type="text"
                variant="outlined"
                value={contactText}
                isFullWidth
                isMultiLines
                isRequired
                label="お問い合わせ内容"
                maxRows={13}
                minRows={2}
                maxLength={1000}
                startIcon={<FontAwesomeIcon icon={faCircleQuestion} />}
              />
            </div>
            <div className={styles.sendButton}>
              <Button
                color="primary"
                variant="contained"
                onClick={contact}
                isDisabled={!isComplete()}
                isFullWidth
              >
                送信
              </Button>
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default Contact;
