import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAtom } from 'jotai';

import styles from './editProfile.module.css';

import { faEnvelope, faIdCard } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import BaCkgroundImage from '@/components/organisms/BackgroundImage';
import Header, { ActionItem } from '@/components/organisms/Header';

import { useEditProfile } from '@/hooks/useEditProfile';
import { authUserAtom } from '@/store';

const EditProfile = () => {
  const [actionItems, setActionItems] = useState<ActionItem[]>([
    {
      item: '保存',
      onClick: (event) => onSave(),
    },
  ]);
  const [userData, setUserData] = useAtom(authUserAtom);

  const {
    onFileload,
    getMyUserData,
    uploadIcon,
    userIconFile,
    myIconUrl,
    name,
    setName,
    email,
    setEmail,
    nameErrorMessage,
    isComplete,
    nameComplete,
    setNameErrorMessage,
    saveUserData,
  } = useEditProfile();
  const navigate = useNavigate();

  const onSave = async () => {
    // if (!isComplete) return;
    // try {
    //   if (!userData) return;
    //   const userUid = userData.uid;
    //   let userIconUrl = INITIAL_ICON_URL;
    //   if (userIconFile) userIconUrl = await uploadIcon(userIconFile, userUid);
    //   await saveUserData(userUid, userIconUrl, name, email);
    //   navigate('/profile');
    // } catch {}
  };

  useEffect(() => {
    try {
      if (userData) {
        // const userId = userData.uid;
        // getMyUserData(userId);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <>
      <Header title="プロフィール" actionItems={actionItems} showBackButton />
      <main>
        <BaCkgroundImage
          hasCameraIcon
          onChange={onFileload}
          iconUrl={myIconUrl}
        />
        <div className={`${styles.contents} inner`}>
          <div className={styles.userForm}>
            <Input
              isFullWidth
              type="text"
              color="primary"
              variant="standard"
              id="nameEditProfile"
              label="ユーザーネーム"
              value={name}
              errorMessage={nameErrorMessage}
              startIcon={<FontAwesomeIcon icon={faIdCard} />}
              onChange={(event) => setName(event.target.value)}
              // onBlur={() => setNameErrorMessage(nameComplete())}
            />
          </div>
          <div className={styles.emailForm}>
            <Input
              isFullWidth
              type="email"
              color="primary"
              variant="standard"
              id="email"
              label="メールアドレス"
              value={email}
              startIcon={<FontAwesomeIcon icon={faEnvelope} />}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <Button
            color="danger"
            variant="outlined"
            onClick={() => navigate('/profile/delete-account')}
            isFullWidth
            className={styles.deleteButton}
          >
            アカウント削除
          </Button>
        </div>
      </main>
    </>
  );
};

export default EditProfile;
