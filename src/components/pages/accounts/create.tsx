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
import Avatar from '@/components/organisms/Avatar';
import AvatarBackgroundImage from '@/components/organisms/AvatarBackgroundImage';
import CoverImageOnlyPc from '@/components/organisms/CoverImageOnlyPc';
import Header from '@/components/organisms/Header';

import { INITIAL_ICON_URL } from '@/constants';
import { InitialUserData, useCreateAccount } from '@/features';
import { useUser } from '@/hooks';
import {
  resizeFile,
  validateBlobSize,
  getFirebaseError,
  isValidPassword,
  fetchUserData,
  convertCanvasToBlob,
} from '@/utils';

const CreateAcconunt = () => {
  const [isOpenErrorModal, setIsOpenErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    '予期せぬエラーが発生しました。お手数ですが、再度ログインしてください。'
  );
  const [userIconBlob, setUserIconBlob] = useState<Blob>();
  // プレビューのiconURL
  const [initialIconUrl, setInitialIconUrl] = useState(INITIAL_ICON_URL);
  const navigate = useNavigate();

  const {
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
    createMyRoom,
    deleteUserDate,
  } = useCreateAccount();

  const { saveUser } = useUser();

  const createAccount = async () => {
    if (!isComplete()) return;

    try {
      // emailとpasswordでサインアップ
      // user情報を返す
      const user = await signUp(email, password);
      const userId = user.uid;

      // リサイズされたプロフィールアイコンをcloudstorageにアップロードする
      let userIconUrl = INITIAL_ICON_URL;
      if (userIconBlob) userIconUrl = await uploadIcon(userIconBlob, userId);

      const initialUserData: InitialUserData = { userName, userIconUrl };
      await registerUserDate(userId, initialUserData);

      const userData = await fetchUserData(userId);

      if (!userData) throw new Error('ユーザー情報がありません。');
      saveUser(userId, userData);

      await createMyRoom(userId);
      // await fetchRoom(roomId);

      navigate('/');
    } catch (error) {
      if (error instanceof FirebaseError) {
        const errorCode = error.code;
        setErrorMessage(getFirebaseError(errorCode));
      }
      setIsOpenErrorModal(true);
      await deleteUserDate(userName, userIconBlob);
    }
  };

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files) return;
      const file = event.target.files[0];
      const canvas = await resizeFile(file);

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
        onClose={() => setIsOpenErrorModal(false)}
        title="エラー"
        titleAlign="center"
        hasInner
        isOpen={isOpenErrorModal}
        isBoldTitle
      >
        <div>
          <p>{errorMessage}</p>
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
      {renderErrorModal()}
      <Header title="アカウント作成" className="sp" showBackButton />
      <main className={isPcWindow ? 'flex' : ''}>
        <CoverImageOnlyPc />
        <div className={styles.container}>
          <section className={styles.contents}>
            <Heading
              tag="h1"
              align="center"
              color="inherit"
              className="pc"
              size="xxl"
            >
              アカウント作成
            </Heading>
            <div className={`${styles.iconImage} ${isPcWindow ? 'inner' : ''}`}>
              <AvatarBackgroundImage
                imageUrl={initialIconUrl}
                className="sp"
                hasCameraIcon
                onChange={onFileChange}
              />
              <Avatar
                iconUrl={initialIconUrl}
                className="pc"
                hasCameraIcon
                isUploadButton={isPcWindow}
                onChange={onFileChange}
                uploadIconSize="l"
              />
            </div>
            <div className={`${styles.formArea} inner`}>
              <div className={styles.form}>
                <Input
                  color="primary"
                  id="name"
                  onChange={(event) => setUserName(event.target.value)}
                  type="text"
                  value={userName}
                  variant={isPcWindow ? 'outlined' : 'standard'}
                  isFullWidth
                  isRequired
                  label="ユーザーネーム"
                  maxLength={20}
                  startIcon={<FontAwesomeIcon icon={faIdCard} />}
                />
                <Input
                  color="primary"
                  id="email"
                  onChange={(event) => setEmail(event.target.value)}
                  type="email"
                  value={email}
                  variant={isPcWindow ? 'outlined' : 'standard'}
                  isFullWidth
                  isRequired
                  label="メールアドレス"
                  startIcon={<FontAwesomeIcon icon={faEnvelope} />}
                />
                <Input
                  color="primary"
                  id="password"
                  onChange={(event) => setPassword(event.target.value)}
                  type="password"
                  value={password}
                  variant={isPcWindow ? 'outlined' : 'standard'}
                  errorMessage={passwordErrorMessage}
                  isFullWidth
                  label="パスワード"
                  minLength={10}
                  onBlur={() => {
                    if (!isValidPassword(password)) {
                      setPasswordErrorMessage('半角英数字で入力してください');
                    } else {
                      setPasswordErrorMessage('');
                    }
                  }}
                  startIcon={<FontAwesomeIcon icon={faLock} />}
                />
              </div>
              <div className={styles.buttonArea}>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={createAccount}
                  isDisabled={!isComplete()}
                  isFullWidth
                  size="medium"
                >
                  作成
                </Button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default CreateAcconunt;
