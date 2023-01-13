import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { FirebaseError } from 'firebase/app';

import styles from './create.module.css';

import {
  faEnvelope,
  faIdCard,
  faLock,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Heading';
import Input from '@/components/atoms/Input';
import Modal from '@/components/molecules/Modal';
import BackgroundImage from '@/components/organisms/BackgroundImage';
import CoverImage from '@/components/organisms/CoverImage';
import Header from '@/components/organisms/Header';

import { getFirebaseError } from '@/utils/firebaseErrorMessage';

import { INITIAL_ICON_URL } from '@/constants';
import { useCreateAccounts } from '@/hooks';
import { InitialUserData } from '@/hooks/useCreateAccounts';

const CreateAcconunts = () => {
  const [open, setOpen] = useState(false);
  const [firebaseError, setFirebaseError] = useState('');
  const navigate = useNavigate();

  const {
    initialIconUrl,
    signUp,
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    nameErrorMessage,
    setNameErrorMessage,
    nameComplete,
    passwordErrorMessage,
    setPasswordErrorMessage,
    passwordComplete,
    isComplete,
    onFileload,
    uploadIcon,
    registerUserDate,
    userIconFile,
    setInitialIconUrl,
  } = useCreateAccounts();

  const handleClick = async () => {
    if (!isComplete()) return;

    try {
      // emailとpasswordでサインアップ
      // user情報を返す
      const user = await signUp(email, password);
      const useId = user.uid;

      // リサイズされたプロフィールアイコンをcloudstorageにアップロードする
      let userIconUrl = INITIAL_ICON_URL;
      if (userIconFile) userIconUrl = await uploadIcon(userIconFile, useId);

      const initialUserData: InitialUserData = { name, userIconUrl };
      await registerUserDate(useId, initialUserData);

      navigate('/');
    } catch (error) {
      setOpen(true);
      if (error instanceof FirebaseError) {
        const errorCode = error.code;
        console.log(errorCode);
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
      <Header
        title="アカウント作成"
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
            アカウント作成
          </Heading>
          <BackgroundImage
            hasCameraIcon
            onChange={onFileload}
            iconUrl={initialIconUrl}
          />
          <div className={styles.formWrapper}>
            <div className={styles.userForm}>
              <Input
                isFullWidth
                type="text"
                color="primary"
                variant="standard"
                id="textCreate"
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
                variant="standard"
                id="emailCreate"
                label="メールアドレス"
                value={email}
                startIcon={<FontAwesomeIcon icon={faEnvelope} />}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <div className={styles.passwordForm}>
              <Input
                isFullWidth
                type="password"
                color="primary"
                variant="standard"
                id="passwordCreate"
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
              className={styles.createButton}
              color="primary"
              variant="contained"
              onClick={handleClick}
              isFullWidth
              isDisabled={!isComplete()}
            >
              作成
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateAcconunts;
