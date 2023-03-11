import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { FirebaseError } from 'firebase/app';
import { signOut } from 'firebase/auth';

import styles from './SideMenu.module.css';

import {
  faCircleUser,
  faComment,
  faHouse,
  faPlus,
  faMagnifyingGlass,
  faBan,
  faRightFromBracket,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Button from '@/components/atoms/Button';
import Modal from '@/components/molecules/Modal';

import { useAuth } from '@/hooks';
import { auth } from '@/main';
import { getFirebaseError } from '@/utils';

const SideMenu = () => {
  const [isOpenErrorModal, setIsOpenErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    '予期せぬエラーが発生しました。お手数ですが、再度ログインしてください。'
  );
  const [isOpenLogOutModal, setIsOpenLogOutModal] = useState(false);
  const location = useLocation();

  const { resetCache } = useAuth();

  const getActiveClass = (path: string) => {
    const slicePath = path.slice(1);
    if (location.pathname === path) {
      return styles.active;
    } else if (location.pathname.indexOf(slicePath) > 0) {
      return styles.active;
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
      resetCache();
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else if (error instanceof FirebaseError) {
        const errorCode = error.code;
        setErrorMessage(getFirebaseError(errorCode));
      }

      setIsOpenErrorModal(true);
    }
  };

  const logOutModal = () => {
    if (!isOpenLogOutModal) return;

    return (
      <Modal
        onClose={() => setIsOpenLogOutModal(false)}
        title="サインアウト"
        titleAlign="center"
        hasInner
        isOpen={isOpenLogOutModal}
        isBoldTitle
      >
        <div>
          <p>サインアウトしますが、よろしいですか？</p>
        </div>
        <div className={styles.controler}>
          <Button
            color="primary"
            onClick={logOut}
            variant="contained"
            isFullWidth
            size="small"
          >
            OK
          </Button>
          <Button
            color="primary"
            onClick={() => setIsOpenLogOutModal(false)}
            variant="outlined"
            isFullWidth
            size="small"
          >
            キャンセル
          </Button>
        </div>
      </Modal>
    );
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
  return (
    <>
      {logOutModal()}
      {renderErrorModal()}
      <div className={`${styles.sideMenu}`}>
        <ul className={styles.navigationItems}>
          <li>
            <Link className={`${getActiveClass('/')} `} to={'/'}>
              <FontAwesomeIcon
                icon={faHouse}
                style={{ marginRight: '8px', marginLeft: '16px' }}
                size={'xl'}
              />
              ホーム
            </Link>
          </li>
          <li>
            <Link className={getActiveClass('/rooms')} to={'/rooms'}>
              <FontAwesomeIcon
                icon={faComment}
                style={{ marginRight: '8px', marginLeft: '16px' }}
                size={'xl'}
              />
              トーク
            </Link>
          </li>
          <li>
            <Link className={getActiveClass('/profile')} to={'/profile'}>
              <FontAwesomeIcon
                icon={faCircleUser}
                style={{ marginRight: '8px', marginLeft: '16px' }}
                size={'xl'}
              />
              プロフィール
            </Link>
          </li>
          <li>
            <Link className={getActiveClass('/search')} to={'/search'}>
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                style={{ marginRight: '8px', marginLeft: '16px' }}
                size={'xl'}
              />
              ユーザー検索
            </Link>
          </li>
          <li>
            <Link className={getActiveClass('/block')} to={'/block'}>
              <FontAwesomeIcon
                icon={faBan}
                style={{ marginRight: '8px', marginLeft: '16px' }}
                size={'xl'}
              />
              ブロックリスト
            </Link>
          </li>
          <li>
            <Link
              className={getActiveClass('/group/create')}
              to={'/group/create'}
            >
              <FontAwesomeIcon
                icon={faPlus}
                style={{ marginRight: '8px', marginLeft: '16px' }}
                size={'xl'}
              />
              グループ作成
            </Link>
          </li>
          <li>
            <button onClick={() => setIsOpenLogOutModal(true)}>
              <FontAwesomeIcon
                icon={faRightFromBracket}
                style={{ marginRight: '8px', marginLeft: '16px' }}
                size={'xl'}
              />
              サインアウト
            </button>
          </li>
        </ul>
      </div>
    </>
  );
};

export default SideMenu;
