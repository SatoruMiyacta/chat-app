import { useEffect, useState } from 'react';

import { FirebaseError } from 'firebase/app';
import { User } from 'firebase/auth';
import { useAtom } from 'jotai';

import styles from './createGroup.module.css';

import {
  faMagnifyingGlass,
  faUser,
  faUsers,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Modal from '@/components/molecules/Modal';
import Avatar from '@/components/organisms/Avatar';
import AvatarList, { IdObject } from '@/components/organisms/AvatarList';
import Header from '@/components/organisms/Header';

import { INITIAL_ICON_URL } from '@/constants';
import { useCreateGroup, useSearch, InitialGroupData } from '@/features';
import { useFriend, useGroup, useUser } from '@/hooks';
import {
  usersAtom,
  authUserAtom,
  UserData,
  groupsAtom,
  friendsIdAtom,
} from '@/store';
import {
  getFirebaseError,
  getCacheExpirationDate,
  fetchUserData,
  isCacheActive,
  resizeFile,
  validateBlobSize,
  isValidPassword,
  convertCanvasToBlob,
  addGroupsData,
  setGroupsMember,
  setDataToJoinedGroups,
  fetchGroupsData,
} from '@/utils';

const CreateMember = () => {
  const [search, setSearch] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [authUser, setAuthUser] = useAtom(authUserAtom);
  const [auth, setAuth] = useState<User>();
  const [users, setUsers] = useAtom(usersAtom);
  const [friends, setFriends] = useAtom(friendsIdAtom);
  const [errorMessage, setErrorMessage] = useState(
    '予期せぬエラーが発生しました。お手数ですが、再度ログインしてください。'
  );
  const [isOpenErrorModal, setIsOpenErrorModal] = useState(false);
  // const [friendList, setFriendList] = useState<string[]>([]);
  const [groupIconBlob, setGroupIconBlob] = useState<Blob>();
  const [initialIconUrl, setInitialIconUrl] = useState(INITIAL_ICON_URL);

  const {
    setLastFriend,
    getMyFriendIdList,
    saveFriendIdList,
    saveFriendData,
    searchFriendsIdList,
    setFriendList,
    friendList,
  } = useFriend();

  const { getUser, saveUser, getSearchedFriends } = useUser();
  const { groupName, setGroupName, isComplete, uploadIcon, createMyRoom } =
    useCreateGroup();

  const { convertnotFriendsObject, searchUserList } = useSearch();
  const { getGroups, saveGroups, saveJoinedGroups } = useGroup();

  const convertObject = (): IdObject => {
    const checkboxObject = friendList.reduce((accumulater, value) => {
      return { ...accumulater, [value]: false };
    }, {});

    return checkboxObject;
  };
  const [checkboxItems, setCheckboxItems] = useState<IdObject>(convertObject());

  const onCheckedUser = (
    event: React.ChangeEvent<HTMLInputElement>,
    index?: number
  ) => {
    if (!checkboxItems) return;

    const checkedId = event.target.id;

    const newItems = { ...checkboxItems };
    newItems[checkedId] = !newItems[checkedId];

    setCheckboxItems(newItems);
  };

  const onExtractGroupMember = () => {
    const groupMemberList = Object.keys(checkboxItems).filter(
      (key) => checkboxItems[key] === true
    );

    setFriendList(groupMemberList);
    setActiveIndex(1);
  };

  const onExcludeUser = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    index: number
  ) => {
    if (!checkboxItems) return;

    const deleteItemsList = [...friendList];
    deleteItemsList.splice(index, 1);

    setFriendList(deleteItemsList);
  };

  const onCreateGroup = async () => {
    try {
      let groupIconUrl = INITIAL_ICON_URL;
      if (groupIconBlob) groupIconUrl = await uploadIcon(groupIconBlob, userId);

      const initialUserData: InitialGroupData = { groupName, groupIconUrl };
      const groupId = await addGroupsData(userId, initialUserData);

      await setGroupsMember(friendList, groupId, userId);

      await setDataToJoinedGroups(friendList, groupId, userId);

      const groupData = await fetchGroupsData(groupId);
      if (groupData) saveGroups(groupId, groupData);
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

  const userId = authUser?.uid || '';
  useEffect(() => {
    try {
      if (!userId) return;

      getMyFriendIdList(true).then((friendIdList) => {
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
      } else if (search) {
        searchFriend();
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

  const handleScroll = async () => {
    if (document.body.scrollHeight !== window.pageYOffset + window.innerHeight)
      return;

    getMyFriendIdList(false).then((friendIdList) => {
      saveFriendData(friendIdList);
      saveFriendIdList(friendIdList);
    });
  };
  useEffect(() => {
    window.document.addEventListener('scroll', handleScroll);
    return () => {
      window.document.removeEventListener('scroll', handleScroll);
    };
  }, []);

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
      <Header title="グループ作成" className="sp" showBackButton />
      {activeIndex === 0 && (
        <div className={styles.container}>
          <div className={`${styles.searchForm} inner`}>
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
          </div>
          {friendList && (
            <AvatarList
              idList={friendList}
              showCheckbox
              checkboxItems={checkboxItems}
              onChange={(event, index) => onCheckedUser(event, index)}
            />
          )}
          <div className={`${styles.buttonArea} flex alic inner`}>
            <Button
              color="primary"
              onClick={onExtractGroupMember}
              variant="contained"
              isFullWidth
              size="small"
            >
              次へ
            </Button>
          </div>
        </div>
      )}
      {activeIndex === 1 && (
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
          <AvatarList
            idList={friendList}
            onClick={onExcludeUser}
            showDeleteButton
          />
          <div className={`${styles.buttonArea} flex alic fdrc inner`}>
            <Button
              color="primary"
              onClick={onCreateGroup}
              variant="contained"
              isDisabled={!isComplete}
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
    </>
  );
};

export default CreateMember;
