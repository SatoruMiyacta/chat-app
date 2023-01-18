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
import CoverImageOnlyPc from '@/components/organisms/CoverImageOnlyPc';
import Header from '@/components/organisms/Header';

import {
  convertBlobFile,
  resizeFile,
  validateBlobFile,
} from '@/utils/fileProcessing';

import { INITIAL_ICON_URL } from '@/constants';
import { InitialUserData, useCreateAccounts } from '@/hooks';
import { getFirebaseError, isValidPassword } from '@/utils';

const CreateAcconunts = () => {
  const [isErrorModal, setIsErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    '予期せぬエラーが発生しました。お手数ですが、再度ログインしてください。'
  );
  const [userIconFile, setUserIconFile] = useState<Blob>();
  // プレビューのiconURL
  const [initialIconUrl, setInitialIconUrl] = useState(INITIAL_ICON_URL);
  const navigate = useNavigate();

  const {
    saveUsersAtom,
    signUp,
    userName,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    passwordErrorMessage,
    setPasswordErrorMessage,
    isComplete,
    uploadIcon,
    registerUserDate,
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

      const initialUserData: InitialUserData = { userName, userIconUrl };
      await registerUserDate(useId, initialUserData);

      saveUsersAtom(useId, initialUserData);

      navigate('/');
    } catch (error) {
      if (error instanceof FirebaseError) {
        const errorCode = error.code;
        setErrorMessage(getFirebaseError(errorCode));
      }

      setIsErrorModal(true);
    }
  };

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const canvas = await resizeFile(event);
      if (!canvas) return;

      const blobFile = await convertBlobFile(canvas);
      if (!blobFile) return;

      const blob = validateBlobFile(blobFile);
      if (!blob) return;

      setUserIconFile(blob);
      setInitialIconUrl(URL.createObjectURL(blob));
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      }

      setIsErrorModal(true);
    }
  };

  const renderErrorModal = () => {
    if (!isErrorModal) return;

    return (
      <Modal
        title="エラー"
        titleAlign="center"
        isOpen={isErrorModal}
        hasInner
        isBoldTitle
        onClose={() => setIsErrorModal(false)}
      >
        <div>
          <p>{errorMessage}</p>
        </div>
        <div className={styles.controler}>
          <Button
            color="primary"
            variant="contained"
            onClick={() => setIsErrorModal(false)}
            isFullWidth
            size="small"
          >
            OK
          </Button>
        </div>
      </Modal>
    );
  };

  // 三項演算子、一行なら可

  const getBackgroundClass = () => {
    if (window.matchMedia('(min-width:1024px)').matches) {
      return `${styles.iconImage} inner`;
    } else {
      return styles.iconImage;
    }
  };

  const windowWidth = window.matchMedia('(min-width:1024px)').matches;
  return (
    <>
      {renderErrorModal()}
      <Header
        title="アカウント作成"
        className={`${styles.header} sp `}
        showBackButton
      />
      <main className={styles.container}>
        <CoverImageOnlyPc />
        <section className={styles.contents}>
          <Heading
            tag="h1"
            align="center"
            color="inherit"
            size="xxl"
            className="pc"
          >
            アカウント作成
          </Heading>
          <div className={getBackgroundClass()}>
            <BackgroundImage
              hasCameraIcon
              onChange={onFileChange}
              iconUrl={initialIconUrl}
              isUploadButton
              uploadIconButtonSize={windowWidth ? 'medium' : 'small'}
            />
          </div>
          <div className={`${styles.formButtonWrapper} inner`}>
            <div className={styles.form}>
              <Input
                isFullWidth
                type="text"
                color="primary"
                variant={windowWidth ? 'outlined' : 'standard'}
                id="textCreate"
                label="ユーザーネーム"
                value={userName}
                isRequired
                startIcon={<FontAwesomeIcon icon={faIdCard} />}
                onChange={(event) => setName(event.target.value)}
              />
              <Input
                isFullWidth
                type="email"
                color="primary"
                variant={windowWidth ? 'outlined' : 'standard'}
                id="emailCreate"
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
                variant={windowWidth ? 'outlined' : 'standard'}
                id="passwordCreate"
                label="パスワード"
                value={password}
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
            </div>
            <div className={styles.fullWidthButton}>
              <Button
                color="primary"
                variant="contained"
                onClick={handleClick}
                isFullWidth
                isDisabled={!isComplete()}
                size="medium"
              >
                作成
              </Button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default CreateAcconunts;
