import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { FirebaseError } from 'firebase/app';
import { deleteObject, ref } from 'firebase/storage';
import { useAtom } from 'jotai';

import styles from './editGroup.module.css';

import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Skeleton from '@/components/atoms/Skeleton';
import Modal from '@/components/molecules/Modal';
import Avatar from '@/components/organisms/Avatar';
import AvatarList from '@/components/organisms/AvatarList';
import Header from '@/components/organisms/Header';

import { INITIAL_ICON_URL } from '@/constants';
import { InitialGroupData } from '@/features';
import { useEditGroup } from '@/features/useEditGroup';
import { useGroup, useUser, UserAndGroupId } from '@/hooks';
import { storage } from '@/main';
import { authUserAtom } from '@/store';
import {
  getFirebaseError,
  resizeFile,
  validateBlobSize,
  convertCanvasToBlob,
  setGroupsMember,
  fetchGroupsData,
  setMyJoinedGroups,
  uploadIcon,
  deleteGroupMember,
} from '@/utils';

const EditGroup = () => {
  const [authUser] = useAtom(authUserAtom);
  const [errorMessage, setErrorMessage] = useState(
    '予期せぬエラーが発生しました。お手数ですが、再度ログインしてください。'
  );
  const [isOpenErrorModal, setIsOpenErrorModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [groupIconBlob, setGroupIconBlob] = useState<Blob>();
  const [groupIconUrl, setGroupIconUrl] = useState(INITIAL_ICON_URL);

  const { saveUserData } = useUser();
  const {
    getGroupMemberIdList,
    setGroupMemberList,
    groupMemberList,
    setGroupName,
    groupName,
    isComplete,
    updateGroupDate,
  } = useEditGroup();

  const { getGroups, saveGroups } = useGroup();

  const userId = authUser?.uid || '';
  const navigate = useNavigate();
  const { postId } = useParams();

  const onExcludeUser = async (index: number) => {
    if (!postId) return;

    const deleteItemsList = [...groupMemberList];

    await deleteGroupMember(postId, deleteItemsList[index]);
    deleteItemsList.splice(index, 1);

    setGroupMemberList(deleteItemsList);
  };

  const onSaveGroup = async () => {
    if (!postId) return;

    const groupId = postId;
    try {
      const userAndGroupId: UserAndGroupId = { groupId };
      let groupIconUrl = INITIAL_ICON_URL;
      if (groupIconBlob)
        groupIconUrl = await uploadIcon(groupIconBlob, groupId);

      const newGroupData: InitialGroupData = { groupName, groupIconUrl };
      await updateGroupDate(groupId, newGroupData);

      await setGroupsMember(groupMemberList, userAndGroupId);

      await setMyJoinedGroups(userAndGroupId);

      const groupData = await fetchGroupsData(groupId);
      if (groupData) saveGroups(groupId, groupData);

      navigate('/');
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

  const getGroupData = async () => {
    if (!postId) return;

    const groupData = await getGroups(postId);
    if (!groupData) return;

    setGroupIconUrl(groupData.iconUrl);
    setGroupName(groupData.name);

    const groupMemberIdList = await getGroupMemberIdList(postId, true);
    const firstGroupMemberIdList = groupMemberIdList.slice(0, 10);
    saveUserData(firstGroupMemberIdList);
    if (groupMemberIdList.length > 10) {
      const secondGroupMemberIdList = groupMemberIdList.slice(10);
      saveUserData(secondGroupMemberIdList);
    }
    setGroupMemberList(groupMemberIdList);
  };

  useEffect(() => {
    try {
      if (!postId) return;
      if (!userId) return;

      getGroupData();
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

  const handleScroll = async () => {
    if (!postId) return;
    if (document.body.scrollHeight !== window.pageYOffset + window.innerHeight)
      return;

    getGroupMemberIdList(postId, false).then((groupMemberIdList) => {
      saveUserData(groupMemberIdList);
      setGroupMemberList(groupMemberIdList);
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
      setGroupIconUrl(URL.createObjectURL(blob));
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
      <Header title="グループ編集" className="sp" showBackButton />
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
      {!isLoading && (
        <div className={styles.container}>
          <div className={`${styles.groupProfile} flex inner`}>
            <Avatar
              iconUrl={groupIconUrl}
              hasCameraIcon
              onChange={onFileChange}
            />
            <Input
              color="primary"
              id="groupName"
              onChange={(event) => setGroupName(event.target.value)}
              type="text"
              value={groupName}
              variant={isPcWindow ? 'outlined' : 'filled'}
              isFullWidth
              isRequired
              label="グループネーム"
            />
          </div>
          <div className={styles.listArea}>
            <AvatarList
              idList={groupMemberList}
              onClick={(index) => onExcludeUser(index)}
              showDeleteButton
            />
          </div>
          <div className={`${styles.buttonArea} flex alic fdrc inner`}>
            <Button
              color="primary"
              onClick={onSaveGroup}
              variant="contained"
              isDisabled={!isComplete}
              isFullWidth
            >
              保存
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default EditGroup;
