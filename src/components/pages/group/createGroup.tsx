import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { FirebaseError } from 'firebase/app';
import { writeBatch } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import { useAtom } from 'jotai';
import { v4 as uuidv4 } from 'uuid';

import styles from './createGroup.module.css';

import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Skeleton from '@/components/atoms/Skeleton';
import Modal from '@/components/molecules/Modal';
import Avatar from '@/components/organisms/Avatar';
import AvatarList, { IdObject } from '@/components/organisms/AvatarList';
import Header from '@/components/organisms/Header';

import { INITIAL_ICON_URL } from '@/constants';
import {
  useCreateGroup,
  useSearch,
  InitialGroupData,
  JoinedRoomsDataObject,
} from '@/features';
import { useFriend, useGroup, useUser, UserAndGroupId } from '@/hooks';
import { db, storage } from '@/main';
import { authUserAtom, joinedGroupsAtom } from '@/store';
import {
  getFirebaseError,
  resizeFile,
  validateBlobSize,
  convertCanvasToBlob,
  setGroupsData,
  setGroupsMember,
  fetchGroupsData,
  setMyJoinedGroups,
  setUsersUnAuthRoom,
  uploadIcon,
  setRoom,
  setUsersJoinedRooms,
} from '@/utils';

const CreateMember = () => {
  const [search, setSearch] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [authUser] = useAtom(authUserAtom);
  const [joinedGroups] = useAtom(joinedGroupsAtom);
  const [errorMessage, setErrorMessage] = useState(
    '予期せぬエラーが発生しました。お手数ですが、再度ログインしてください。'
  );
  const [isOpenErrorModal, setIsOpenErrorModal] = useState(false);
  const [isOpenCompleteModal, setIsOpenCompleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [groupIconBlob, setGroupIconBlob] = useState<Blob>();
  const [initialIconUrl, setInitialIconUrl] = useState(INITIAL_ICON_URL);
  const [filterFriendList, setFilterFriendList] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const {
    getMyFriendIdList,
    saveFriendIdList,
    saveFriendData,
    setFriendList,
    friendList,
  } = useFriend();
  const { getSearchedFriends } = useUser();
  const { groupName, setGroupName, isComplete } = useCreateGroup();
  const { searchUserList } = useSearch();
  const { saveGroups, saveJoinedGroups } = useGroup();

  const convertObject = (): IdObject => {
    const checkboxObject = friendList.reduce((accumulater, value) => {
      return { ...accumulater, [value]: false };
    }, {});

    return checkboxObject;
  };
  const [checkboxItems, setCheckboxItems] = useState<IdObject>(convertObject());
  const navigate = useNavigate();
  const onCheckedUser = (
    event: React.ChangeEvent<HTMLInputElement>,
    index?: number
  ) => {
    if (!checkboxItems) return;

    const checkedId = event.target.id;

    const newItems = { ...checkboxItems };
    newItems[checkedId] = !newItems[checkedId];

    const groupMemberList = Object.keys(newItems).filter(
      (key) => newItems[key] === true
    );

    setFilterFriendList(groupMemberList);

    setCheckboxItems(newItems);
  };

  const onExcludeUser = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    index: number
  ) => {
    if (!checkboxItems) return;

    const deleteItemsList = [...filterFriendList];
    deleteItemsList.splice(index, 1);

    setFilterFriendList(deleteItemsList);
  };

  const onCreateGroup = async () => {
    const groupId = uuidv4();
    try {
      let groupIconUrl = INITIAL_ICON_URL;
      if (groupIconBlob) groupIconUrl = await uploadIcon(groupIconBlob, userId);

      const batch = writeBatch(db);

      const userAndGroupId: UserAndGroupId = { userId, groupId };
      const initialGroupData: InitialGroupData = { groupName, groupIconUrl };

      const type = 'group';
      const anotherId = groupId;
      const isVisible = true;
      const joinedRoomsDataObject: JoinedRoomsDataObject = {
        anotherId,
        type,
        isVisible,
      };

      await setGroupsData(userAndGroupId, initialGroupData, batch);

      await setGroupsMember(filterFriendList, userAndGroupId, batch);

      await setMyJoinedGroups(userAndGroupId, batch);

      await setUsersJoinedRooms(userId, groupId, joinedRoomsDataObject, batch);

      await setRoom(userId, groupId, batch);

      // 他のメンバーのunAuthRoomに追加
      await setUsersUnAuthRoom(groupId, filterFriendList, groupId, type, batch);

      await batch.commit();

      const groupData = await fetchGroupsData(groupId);
      if (groupData) saveGroups(groupId, groupData);

      if (joinedGroups && typeof joinedGroups !== 'undefined') {
        const joinedGroupsCacheList = joinedGroups.data as string[];
        joinedGroupsCacheList.unshift(groupId);
        saveJoinedGroups(joinedGroupsCacheList);
      }

      setIsOpenCompleteModal(true);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else if (error instanceof FirebaseError) {
        const errorCode = error.code;
        setErrorMessage(getFirebaseError(errorCode));
      }

      setIsOpenErrorModal(true);
      if (groupIconBlob) {
        const desertRef = ref(storage, `iconImage/groups/${groupId}/groupIcon`);

        if (desertRef) await deleteObject(desertRef);
      }
    }
  };

  const userId = authUser?.uid || '';
  useEffect(() => {
    try {
      if (!userId) return;

      getMyFriendIdList(false).then((friendIdList) => {
        saveFriendData(friendIdList);
        saveFriendIdList(friendIdList);
      });
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else if (error instanceof FirebaseError) {
        const errorCode = error.code;
        setErrorMessage(getFirebaseError(errorCode));
      }

      setIsOpenErrorModal(true);
    }
    setIsLoading(false);
  }, [userId]);

  const searchFriend = async () => {
    const searchList = await searchUserList(search);
    const searchedFriendsIdList = await getSearchedFriends(searchList, userId);
    if (searchedFriendsIdList) {
      setFriendList(searchedFriendsIdList);
    } else {
      setFriendList([]);
    }
  };

  useEffect(() => {
    if (!userId) return;

    try {
      if (!search) {
        getMyFriendIdList(true).then((friendIdList) => {
          saveFriendData(friendIdList);
          saveFriendIdList(friendIdList);
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
      contentsHeight = window.innerHeight - 232;
    }

    if (
      scrollRefCurrent.scrollHeight !==
      scrollRefCurrent.scrollTop + contentsHeight
    )
      return;

    getMyFriendIdList(false).then((friendIdList) => {
      saveFriendData(friendIdList);
      saveFriendIdList(friendIdList);
    });
  };
  useEffect(() => {
    scrollRefCurrent?.addEventListener('scroll', handleScroll);
    return () => {
      scrollRefCurrent?.removeEventListener('scroll', handleScroll);
    };
  }, [scrollRefCurrent]);

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

      setGroupIconBlob(blob);
      setInitialIconUrl(URL.createObjectURL(blob));
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      }

      setIsOpenErrorModal(true);
    }
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
          <p>グループが作成されました</p>
        </div>
        <div className={styles.controler}>
          <Button
            color="primary"
            onClick={() => navigate('/')}
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
      {renderCompleteModal()}
      {renderErrorModal()}
      <Header title="グループ作成" className="sp" showBackButton />
      {isLoading && (
        <>
          <div className={styles.container}>
            <div className={`${styles.searchForm} inner`}>
              <Skeleton variant="rectangular" height={32} />
            </div>
            <Skeleton variant="rectangular" height={550} />
            <div className={`${styles.buttonArea} flex alic inner`}>
              <Skeleton variant="rectangular" height={32} radius={32} />
            </div>
          </div>
        </>
      )}
      {!isLoading && activeIndex === 0 && !isPcWindow && (
        <div className={styles.container}>
          <div className={`${styles.searchForm} flex inner`}>
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
            <button onClick={searchFriend}>
              {<FontAwesomeIcon icon={faMagnifyingGlass} />}
            </button>
          </div>
          {friendList.length !== 0 && (
            <div ref={scrollRef} className={styles.contents}>
              <AvatarList
                idList={friendList}
                showCheckbox
                checkboxItems={checkboxItems}
                onChange={(event, index) => onCheckedUser(event, index)}
              />
            </div>
          )}
          <div className={`${styles.buttonArea} flex alic inner`}>
            <Button
              color="primary"
              onClick={() => setActiveIndex(1)}
              variant="contained"
              isFullWidth
              size="small"
            >
              次へ
            </Button>
          </div>
        </div>
      )}
      {!isLoading && activeIndex === 1 && !isPcWindow && (
        <div className={styles.container}>
          <div className={`${styles.groupProfile} flex inner`}>
            <Avatar
              iconUrl={initialIconUrl}
              hasCameraIcon
              onChange={onFileChange}
            />
            <Input
              color="primary"
              id="groupName"
              onChange={(event) => setGroupName(event.target.value)}
              type="text"
              value={groupName}
              variant="filled"
              isFullWidth
              isRequired
              placeholder="グループネーム"
            />
          </div>
          <div ref={scrollRef} className={styles.contents}>
            <AvatarList
              idList={filterFriendList}
              onClick={onExcludeUser}
              showDeleteButton
            />
          </div>
          <div className={`${styles.buttonArea} flex alic fdrc inner`}>
            <Button
              color="primary"
              onClick={onCreateGroup}
              variant="contained"
              isDisabled={!isComplete()}
              isFullWidth
              size="small"
            >
              作成
            </Button>
            <Button
              color="primary"
              onClick={() => setActiveIndex(0)}
              variant="outlined"
              isFullWidth
              size="small"
            >
              メンバー選択に戻る
            </Button>
          </div>
        </div>
      )}
      {!isLoading && isPcWindow && (
        <div className={`${styles.container} flex`}>
          <div className={`${styles.filterMember} `}>
            <div className={`${styles.searchForm} flex inner`}>
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
              <button onClick={searchFriend}>
                {<FontAwesomeIcon icon={faMagnifyingGlass} />}
              </button>
            </div>
            {friendList.length !== 0 && (
              <div ref={scrollRef} className={styles.contents}>
                <AvatarList
                  idList={friendList}
                  showCheckbox
                  checkboxItems={checkboxItems}
                  onChange={(event, index) => onCheckedUser(event, index)}
                />
              </div>
            )}
          </div>
          <div className={`${styles.groupOverView} `}>
            <div className={`${styles.groupProfile} flex inner`}>
              <Avatar
                iconUrl={initialIconUrl}
                hasCameraIcon
                onChange={onFileChange}
              />
              <Input
                color="primary"
                id="groupName"
                onChange={(event) => setGroupName(event.target.value)}
                type="text"
                value={groupName}
                variant="standard"
                isFullWidth
                isRequired
                label="グループネーム"
              />
            </div>
            <div ref={scrollRef} className={styles.contents}>
              <AvatarList
                idList={filterFriendList}
                onClick={onExcludeUser}
                showDeleteButton
              />
            </div>
            <div className={`${styles.buttonArea} flex alic fdrc inner`}>
              <Button
                color="primary"
                onClick={onCreateGroup}
                variant="contained"
                isDisabled={!isComplete()}
                isFullWidth
                size="small"
              >
                作成
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateMember;
