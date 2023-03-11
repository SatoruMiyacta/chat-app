import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { FirebaseError } from 'firebase/app';
import { useAtom } from 'jotai';

import styles from './HomeOverview.module.css';

import {
  faMagnifyingGlass,
  faUser,
  faUsers,
  faPlus,
  faBan,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Button from '@/components/atoms/Button';
import Fab from '@/components/atoms/FloatingActionButton';
import Input from '@/components/atoms/Input';
import Skeleton from '@/components/atoms/Skeleton';
import Tabs from '@/components/atoms/Tabs';
import Modal from '@/components/molecules/Modal';
import AvatarList, { MenuObject } from '@/components/organisms/AvatarList';

import { useBlock, useHome, useSearch } from '@/features';
import { useUser, useGroup, useTalkRoom } from '@/hooks';
import { useFriend } from '@/hooks/useFriend';
import { authUserAtom, blockUserIdAtom, joinedRoomListAtom } from '@/store';
import {
  getFirebaseError,
  deletefriends,
  setUsersBlockUser,
  updateJoinedRoomsIsVisible,
  searchRoomId,
  deleteJoinedRooms,
  deleteGroupMember,
  deleteJoinedGroups,
} from '@/utils';

const HomeOverview = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [friendSearch, setFriendSearch] = useState('');
  const [groupSearch, setGroupSearch] = useState('');
  const [authUser] = useAtom(authUserAtom);
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState(
    '予期せぬエラーが発生しました。お手数ですが、再度ログインしてください。'
  );
  const [cautionMessage, setCautionMessage] = useState(
    '友達一覧とトークルームが削除されます。よろしいですか？'
  );
  const [blockUser] = useAtom(blockUserIdAtom);
  const [isOpenErrorModal, setIsOpenErrorModal] = useState(false);
  const [isOpenDeleteCautionModal, setIsOpenDeleteCautionModal] =
    useState(false);
  const [isOpenCompleteModal, setIsOpenCompleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const [joinedRoomsList] = useAtom(joinedRoomListAtom);
  const [isSearchResults, setIsSearchResults] = useState(true);

  const {
    getMyGroupIdList,
    saveGroupsIdList,
    setJoinedGroupList,
    joinedGroupList,
    searchGroupList,
  } = useHome();

  const { saveBlockUserIdList } = useBlock();

  const {
    getMyFriendIdList,
    saveFriendIdList,
    saveFriendData,
    setFriendList,
    friendList,
  } = useFriend();

  const { saveGroupData, getSearchedJoinedGroups } = useGroup();
  const { saveJoinedRoomsList } = useTalkRoom();

  const { getSearchedFriends } = useUser();
  const { searchUserList } = useSearch();
  const scrollRef = useRef<HTMLDivElement>(null);
  const tabs = [
    {
      label: '友達',
      icon: <FontAwesomeIcon icon={faUser} />,
      isDisabled: false,
    },
    {
      label: 'グループ',
      icon: <FontAwesomeIcon icon={faUsers} />,
      isDisabled: false,
    },
  ];

  const convertFriendObject = (): MenuObject => {
    const friendMenuItems: MenuObject = {};
    for (const id of friendList) {
      friendMenuItems[id] = [
        {
          label: (
            <>
              <FontAwesomeIcon
                icon={faBan}
                style={{ marginRight: '8px', opacity: 0.5 }}
              />
              ブロック
            </>
          ),
          onClick: () => blockFriend(id),
        },
        {
          label: (
            <>
              <FontAwesomeIcon
                icon={faTrash}
                style={{ width: '16px', marginRight: '8px', opacity: 0.5 }}
              />
              削除
            </>
          ),
          onClick: () => {
            setDeleteId(id);
            setCautionMessage(
              '友達一覧とトークルームが削除されます。よろしいですか？'
            );
            setIsOpenDeleteCautionModal(true);
          },
        },
      ];
    }

    return friendMenuItems;
  };

  const convertGroupObject = (): MenuObject => {
    const groupMenuItems: MenuObject = {};
    for (const id of joinedGroupList) {
      groupMenuItems[id] = [
        {
          label: (
            <>
              <FontAwesomeIcon
                icon={faTrash}
                style={{ marginRight: '8px', opacity: 0.5 }}
              />
              退会
            </>
          ),
          onClick: () => {
            setDeleteId(id);
            setCautionMessage(
              'グループとトークルームが削除されます。よろしいですか？'
            );
            setIsOpenDeleteCautionModal(true);
          },
        },
      ];
    }

    return groupMenuItems;
  };

  const changeActiveTab = (index: number) => {
    if (tabs[index] !== tabs[activeIndex]) setActiveIndex(index);
  };

  const blockFriend = async (friendId: string) => {
    const roomId = await searchRoomId(userId, friendId);

    if (!roomId) return;

    const deleteList = [...friendList];
    const friendIndex = deleteList.indexOf(friendId);
    deleteList.splice(friendIndex, 1);

    setFriendList(deleteList);
    saveFriendIdList(deleteList);

    const roomList = joinedRoomsList?.data as string[];
    if (roomList.length !== 0) {
      const newJoinedRoomsList = [...roomList];
      const roomsIndex = newJoinedRoomsList.indexOf(roomId);
      newJoinedRoomsList.splice(roomsIndex, 1);

      saveJoinedRoomsList(newJoinedRoomsList);
    }

    await setUsersBlockUser(userId, friendId);
    await updateJoinedRoomsIsVisible(userId, roomId);
    await deletefriends(userId, friendId);

    const blockUserIdListCache = blockUser?.data as string[];
    if (blockUserIdListCache) blockUserIdListCache.push(friendId);

    saveBlockUserIdList(blockUserIdListCache);
  };

  const deleteFriendAndGroup = async () => {
    const roomId = await searchRoomId(userId, deleteId);
    if (!roomId) return;

    // groupIdとroomIdは一緒
    if (roomId === deleteId) {
      const deleteList = [...joinedGroupList];
      const index = deleteList.indexOf(deleteId);
      deleteList.splice(index, 1);

      setJoinedGroupList(deleteList);
      saveGroupsIdList(deleteList);

      await deleteJoinedRooms(userId, roomId);
      await deleteGroupMember(deleteId, userId);
      await deleteJoinedGroups(userId, deleteId);
    } else {
      const deleteList = [...friendList];
      const index = deleteList.indexOf(deleteId);
      deleteList.splice(index, 1);

      setFriendList(deleteList);
      saveFriendIdList(deleteList);

      await deleteJoinedRooms(userId, roomId);
      await deletefriends(userId, deleteId);
    }
    setIsOpenCompleteModal(true);
  };

  const userId = authUser?.uid || '';
  useEffect(() => {
    try {
      if (!userId) return;
      getMyFriendIdList(true).then((friendIdList) => {
        saveFriendData(friendIdList);
        saveFriendIdList(friendIdList);
      });

      getMyGroupIdList(true).then((groupIdList) => {
        //  ２０件取得しているため、10件ずつに分割
        const firstGroupIdList = groupIdList.slice(0, 10);
        saveGroupData(firstGroupIdList);
        if (groupIdList.length > 10) {
          const secondGroupIdList = groupIdList.slice(10);
          saveGroupData(secondGroupIdList);
        }
        saveGroupsIdList(groupIdList);

        setJoinedGroupList(groupIdList);
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
    const searchList = await searchUserList(friendSearch);
    const searchedFriendsIdList = await getSearchedFriends(searchList, userId);
    if (searchedFriendsIdList && searchedFriendsIdList.length !== 0) {
      setFriendList(searchedFriendsIdList);
    } else {
      setIsSearchResults(false);
      setFriendList([]);
    }
  };

  const searchGroup = async () => {
    const searchList = await searchGroupList(groupSearch);
    const searchedGroupsIdList = await getSearchedJoinedGroups(
      searchList,
      userId
    );
    if (searchedGroupsIdList && searchedGroupsIdList.length !== 0) {
      setJoinedGroupList(searchedGroupsIdList);
    } else {
      setIsSearchResults(false);
      setJoinedGroupList([]);
    }
  };

  const searchList = async () => {
    if (!userId) return;
    if (activeIndex === 0 && !friendSearch) return;
    if (activeIndex === 1 && !groupSearch) return;

    try {
      if (activeIndex === 0) {
        searchFriend();
      } else if (activeIndex === 1) {
        searchGroup();
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
  };

  useEffect(() => {
    if (!userId) return;
    if (!isSearchResults) setIsSearchResults(true);
    if (activeIndex === 0 && friendSearch) return;
    if (activeIndex === 1 && groupSearch) return;

    try {
      if (activeIndex === 0) {
        getMyFriendIdList(true).then((friendIdList) => {
          saveFriendData(friendIdList);
          saveFriendIdList(friendIdList);
        });
      } else if (activeIndex === 1) {
        getMyGroupIdList(true).then((groupIdList) => {
          const firstGroupIdList = groupIdList.slice(0, 10);
          saveGroupData(firstGroupIdList);
          if (groupIdList.length > 10) {
            const secondGroupIdList = groupIdList.slice(10);
            saveGroupData(secondGroupIdList);
          }
          saveGroupsIdList(groupIdList);
          setJoinedGroupList(groupIdList);
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
  }, [friendSearch, groupSearch, activeIndex]);

  const scrollRefCurrent = scrollRef.current;
  const isPcWindow = window.matchMedia('(min-width:1024px)').matches;

  const handleScroll = async () => {
    if (!scrollRefCurrent) return;

    let contentsHeight;
    if (isPcWindow) {
      contentsHeight = window.innerHeight - 80;
    } else {
      contentsHeight = window.innerHeight - 192;
    }

    if (
      scrollRefCurrent.scrollHeight !==
      scrollRefCurrent.scrollTop + contentsHeight
    )
      return;

    if (activeIndex === 0) {
      getMyFriendIdList(false).then((friendIdList) => {
        saveFriendData(friendIdList);
        saveFriendIdList(friendIdList);
      });
    } else if (activeIndex === 1) {
      getMyGroupIdList(true).then((groupIdList) => {
        const firstGroupIdList = groupIdList.slice(0, 10);
        saveGroupData(firstGroupIdList);
        if (groupIdList.length > 10) {
          const secondGroupIdList = groupIdList.slice(10);
          saveGroupData(secondGroupIdList);
        }
        saveGroupsIdList(groupIdList);
        setJoinedGroupList(groupIdList);
      });
    }
  };
  useEffect(() => {
    scrollRefCurrent?.addEventListener('scroll', handleScroll);

    return () => {
      scrollRefCurrent?.removeEventListener('scroll', handleScroll);
    };
  }, [scrollRefCurrent]);

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

  const renderDeleteCautionModal = () => {
    if (!isOpenDeleteCautionModal) return;

    return (
      <Modal
        onClose={() => setIsOpenDeleteCautionModal(false)}
        title="注意"
        titleAlign="center"
        hasInner
        isOpen={isOpenDeleteCautionModal}
        isBoldTitle
      >
        <div>
          <p>{cautionMessage}</p>
        </div>
        <div className={styles.controler}>
          <Button
            color="primary"
            onClick={() => {
              deleteFriendAndGroup();
              setIsOpenDeleteCautionModal(false);
            }}
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
          <p>削除が完了しました</p>
        </div>
        <div className={styles.controler}>
          <Button
            color="primary"
            onClick={() => {
              setIsOpenCompleteModal(false);
            }}
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
      {renderDeleteCautionModal()}
      {renderErrorModal()}
      {renderCompleteModal()}
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
            <div className={styles.tabs}>
              <Tabs
                activeIndex={activeIndex}
                color="black"
                items={tabs}
                onClick={(index) => changeActiveTab(index)}
                isBorder
              />
            </div>
            {activeIndex === 0 && (
              <>
                <div className={`${styles.searchForm} flex inner`}>
                  <Input
                    color="primary"
                    id="search"
                    onChange={(event) => setFriendSearch(event.target.value)}
                    type="text"
                    value={friendSearch}
                    variant="filled"
                    isFullWidth
                    placeholder="search"
                    startIcon={<FontAwesomeIcon icon={faMagnifyingGlass} />}
                  />
                  <Button
                    color="primary"
                    variant="contained"
                    isRounded={false}
                    onClick={searchList}
                    size="large"
                  >
                    検索
                  </Button>
                </div>
                <div ref={scrollRef} className={styles.contents}>
                  {isSearchResults && (
                    <AvatarList
                      idList={friendList}
                      menuItems={convertFriendObject()}
                    />
                  )}
                  {!isSearchResults && <p>ユーザーが見つかりませんでした</p>}
                  <div className={`${styles.fab} sp`}>
                    <Fab
                      color="primary"
                      onClick={() => navigate('/search')}
                      variant="circular"
                      size="large"
                    >
                      <FontAwesomeIcon icon={faPlus} />
                    </Fab>
                  </div>
                </div>
              </>
            )}
            {activeIndex === 1 && (
              <>
                <div className={`${styles.searchForm} flex inner`}>
                  <Input
                    color="primary"
                    id="search"
                    onChange={(event) => setGroupSearch(event.target.value)}
                    type="text"
                    value={groupSearch}
                    variant="filled"
                    isFullWidth
                    placeholder="search"
                    startIcon={<FontAwesomeIcon icon={faMagnifyingGlass} />}
                  />
                  <Button
                    color="primary"
                    variant="contained"
                    isRounded={false}
                    onClick={searchList}
                    size="large"
                  >
                    検索
                  </Button>
                </div>
                <div ref={scrollRef} className={styles.contents}>
                  {isSearchResults && (
                    <AvatarList
                      idList={joinedGroupList}
                      menuItems={convertGroupObject()}
                    />
                  )}
                  {!isSearchResults && <p>グループが見つかりませんでした</p>}
                  <div className={`${styles.fab} sp`}>
                    <Fab
                      color="primary"
                      onClick={() => navigate('/group/create')}
                      variant="circular"
                      size="large"
                    >
                      <FontAwesomeIcon icon={faPlus} />
                    </Fab>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </main>
    </>
  );
};

export default HomeOverview;
