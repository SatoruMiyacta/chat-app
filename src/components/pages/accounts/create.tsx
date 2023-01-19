import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { FirebaseError } from 'firebase/app';
import { useAtom, useSetAtom } from 'jotai';

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
  convertCanvasToBlob,
  resizeFile,
  validateBlobSize,
} from '@/utils/fileProcessing';

import { INITIAL_ICON_URL } from '@/constants';
import { InitialUserData, useCreateAccount } from '@/hooks';
import { UserData, usersAtom } from '@/store';
import { getFirebaseError, isValidPassword } from '@/utils';

const CreateAcconunt = () => {
  const setUsers = useSetAtom(usersAtom);
  const [isOpenErrorModal, setIsOpenErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    '予期せぬエラーが発生しました。お手数ですが、再度ログインしてください。'
  );
  const [userIconBlob, setUserIconBlob] = useState<Blob>();
  // プレビューのiconURL
  const [initialIconUrl, setInitialIconUrl] = useState(INITIAL_ICON_URL);
  const navigate = useNavigate();

  const {
    getUserData,
    signUp,
    userName,
    setUserName,
    email,
    setEmail,
    password,
    setPassword,
    passwordErrorMessage,
    setPasswordErrorMessage,
    isComplete,
    uploadIcon,
    registerUserDate,
  } = useCreateAccount();

  const createAccount = async () => {
    if (!isComplete()) return;

    try {
      // emailとpasswordでサインアップ
      // user情報を返す
      const user = await signUp(email, password);
      const useId = user.uid;

      // リサイズされたプロフィールアイコンをcloudstorageにアップロードする
      let userIconUrl = INITIAL_ICON_URL;
      if (userIconBlob) userIconUrl = await uploadIcon(userIconBlob, useId);

      const initialUserData: InitialUserData = { userName, userIconUrl };
      await registerUserDate(useId, initialUserData);

      const data = await getUserData(useId);
      if (!data) return;

      const userData: UserData = {
        name: data.name,
        iconUrl: data.iconUrl,
        createdAt: data.createdAt,
        updateAt: data.updateAt,
      };

      const now = new Date();
      setUsers((prevState) => ({
        ...prevState,
        [useId]: { data: userData, expiresIn: now },
      }));

      // setUsers({ [useId]: { data: userData, expiresIn: now } });

      navigate('/');
    } catch (error) {
      if (error instanceof FirebaseError) {
        const errorCode = error.code;
        setErrorMessage(getFirebaseError(errorCode));
      }

      setIsOpenErrorModal(true);
    }
  };

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const canvas = await resizeFile(event);
      if (!canvas) {
        throw new Error(
          '画像が読み込めません。お手数ですが、再度アップロードしてください。'
        );
      }

      const blobFile = await convertCanvasToBlob(canvas);

      const blob = validateBlobSize(blobFile);

      setUserIconBlob(blob);
      setInitialIconUrl(URL.createObjectURL(blob));
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      }

      setIsOpenErrorModal(true);
    }
  };

  const renderErrorModal = () => {
    if (!isOpenErrorModal) return;

    return (
      <Modal
        title="エラー"
        titleAlign="center"
        isOpen={isOpenErrorModal}
        hasInner
        isBoldTitle
        onClose={() => setIsOpenErrorModal(false)}
      >
        <div>
          <p>{errorMessage}</p>
        </div>
        <div className={styles.controler}>
          <Button
            color="primary"
            variant="contained"
            onClick={() => setIsOpenErrorModal(false)}
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
          <div className={`${styles.iconImage} ${isPcWindow ? 'inner' : ''}`}>
            <BackgroundImage
              hasCameraIcon
              onChange={onFileChange}
              iconUrl={initialIconUrl}
              isUploadButton
              uploadIconButtonSize={isPcWindow ? 'medium' : 'small'}
            />
          </div>
          <div className={`${styles.formArea} inner`}>
            <div className={styles.form}>
              <Input
                isFullWidth
                type="text"
                color="primary"
                variant={isPcWindow ? 'outlined' : 'standard'}
                id="textCreate"
                label="ユーザーネーム"
                value={userName}
                isRequired
                startIcon={<FontAwesomeIcon icon={faIdCard} />}
                onChange={(event) => setUserName(event.target.value)}
              />
              <Input
                isFullWidth
                type="email"
                color="primary"
                variant={isPcWindow ? 'outlined' : 'standard'}
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
                variant={isPcWindow ? 'outlined' : 'standard'}
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
            <div className={styles.buttonArea}>
              <Button
                color="primary"
                variant="contained"
                onClick={createAccount}
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

export default CreateAcconunt;
