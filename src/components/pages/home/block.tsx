import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { FirebaseError } from 'firebase/app';
import { useAtom } from 'jotai';

import styles from './block.module.css';

import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Skeleton from '@/components/atoms/Skeleton';
import Modal from '@/components/molecules/Modal';
import AvatarList from '@/components/organisms/AvatarList';
import Header from '@/components/organisms/Header';
import PcNavigation from '@/components/organisms/PcNavigation';
import UsersOverview from '@/components/organisms/UserOverview';

import { useSearch, useBlock } from '@/features';
import { useFriend } from '@/hooks';
import { authUserAtom, friendsIdAtom } from '@/store';
import { getFirebaseError, deleteBlockUser, setFriend } from '@/utils';

const Block = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [authUser] = useAtom(authUserAtom);
  const [friends] = useAtom(friendsIdAtom);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(
    '予期せぬエラーが発生しました。お手数ですが、再度ログインしてください。'
  );
  const [isOpenErrorModal, setIsOpenErrorModal] = useState(false);
  const [isOpenCompleteModal, setIsOpenCompleteModal] = useState(false);
  const [searchPatams] = useSearchParams();

  const {
    getBlockUserIdList,
    saveBlockUserIdList,
    setBlockUserList,
    blockUserList,
    saveBlockUserData,
    getSearchedBlockUser,
  } = useBlock();

  const { saveFriendIdList } = useFriend();
  const { searchUserList } = useSearch();
  const scrollRef = useRef<HTMLDivElement>(null);

  const userPathId = searchPatams.get('userId');

  const onExcludeUser = async (index: number) => {
    if (!userId) return;

    const deleteItemsList = [...blockUserList];
    const unBlockUserId = deleteItemsList[index];

    deleteItemsList.splice(index, 1);

    await deleteBlockUser(userId, unBlockUserId);

    await setFriend(userId, unBlockUserId);

    saveBlockUserIdList(deleteItemsList);
    setBlockUserList(deleteItemsList);

    const friendIdListCache = friends?.data as string[];
    if (friendIdListCache && friendIdListCache.length !== 0) {
      friendIdListCache.push(unBlockUserId);
      saveFriendIdList(friendIdListCache);
    }

    setIsOpenCompleteModal(true);
  };

  const userId = authUser?.uid || '';
  useEffect(() => {
    try {
      if (!userId) return;
      getBlockUserIdList(true).then((blockUserIdList) => {
        saveBlockUserIdList(blockUserIdList);
        saveBlockUserData(blockUserIdList);
      });
      setIsLoading(false);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else if (error instanceof FirebaseError) {
        const errorCode = error.code;
        setErrorMessage(getFirebaseError(errorCode));
      }

      setIsOpenErrorModal(true);
    }
  }, [userId]);

  const searchFriend = async () => {
    const searchList = await searchUserList(search);
    const searchedBlockUserIdList = await getSearchedBlockUser(
      searchList,
      userId
    );
    if (searchedBlockUserIdList) {
      setBlockUserList(searchedBlockUserIdList);
    } else {
      setBlockUserList([]);
    }
  };

  useEffect(() => {
    if (!userId) return;

    try {
      if (!search) {
        getBlockUserIdList(true).then((blockUserIdList) => {
          saveBlockUserIdList(blockUserIdList);
          saveBlockUserData(blockUserIdList);
        });
      }
    } catch (error) {
      if (error instanceof FirebaseError) {
        const errorCode = error.code;
        setErrorMessage(getFirebaseError(errorCode));
      } else if (error instanceof Error) {
        setErrorMessage(error.message);
      }
      setIsOpenErrorModal(true);
    }
  }, [search]);

  const scrollRefCurrent = scrollRef.current;
  const isPcWindow = window.matchMedia('(min-width:1024px)').matches;

  const handleScroll = async () => {
    if (!scrollRefCurrent) return;

    let contentsHeight;
    if (isPcWindow) {
      contentsHeight = window.innerHeight - 80;
    } else {
      contentsHeight = window.innerHeight - 136;
    }

    if (
      scrollRefCurrent.scrollHeight !==
      scrollRefCurrent.scrollTop + contentsHeight
    )
      return;

    getBlockUserIdList(false).then((blockUserIdList) => {
      saveBlockUserIdList(blockUserIdList);
      saveBlockUserData(blockUserIdList);
    });
  };
  useEffect(() => {
    scrollRefCurrent?.addEventListener('scroll', handleScroll);

    return () => {
      scrollRefCurrent?.removeEventListener('scroll', handleScroll);
    };
  }, [scrollRefCurrent]);

  const renderCompleteModal = () => {
    if (!isOpenCompleteModal) return;

    return (
      <Modal
        onClose={() => setIsOpenCompleteModal(false)}
        title="完了"
        titleAlign="center"
        hasInner
        isOpen={isOpenCompleteModal}
        isBoldTitle
      >
        <div>
          <p>ブロックを解除しました</p>
        </div>
        <div className={styles.controler}>
          <Button
            color="primary"
            onClick={() => setIsOpenCompleteModal(false)}
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
      {renderErrorModal()}
      {renderCompleteModal()}
      <Header title="ブロックユーザー" className="sp" showBackButton />
      <main className={`${styles.pcLayout} grow`}>
        {isLoading && (
          <div className={styles.container}>
            <div className={styles.tabs}>
              <Skeleton variant="rectangular" height={32} />
            </div>
            <div className={`${styles.searchForm} inner`}>
              <Skeleton variant="rectangular" height={32} />
            </div>
            <div className={styles.contents}>
              <Skeleton variant="rectangular" height={550} />
              <div className={styles.fab}>
                <Skeleton variant="circular" />
              </div>
            </div>
          </div>
        )}
        {!isLoading && (
          <div className={styles.container}>
            <div className={`${styles.searchForm} inner flex`}>
              <Input
                color="primary"
                id="search"
                onChange={(event) => setSearch(event.target.value)}
                type="text"
                value={search}
                variant="filled"
                isFullWidth
                placeholder="search"
                startIcon={<FontAwesomeIcon icon={faMagnifyingGlass} />}
              />
              <Button
                color="primary"
                variant="contained"
                isRounded={false}
                onClick={searchFriend}
                size="large"
              >
                検索
              </Button>
            </div>
            <div ref={scrollRef} className={styles.contents}>
              <AvatarList
                idList={blockUserList}
                isBlockUser
                onClick={(index) => onExcludeUser(index)}
                showDeleteButton
              />
            </div>
          </div>
        )}
        <div className="pc">
          {!userPathId && (
            <PcNavigation>解除ボタンでブロック解除できます</PcNavigation>
          )}
          {userPathId && <UsersOverview userId={userPathId} />}
        </div>
      </main>
    </>
  );
};

export default Block;
