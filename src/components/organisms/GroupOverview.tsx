import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { FirebaseError } from 'firebase/app';
import { useAtom } from 'jotai';

import styles from './GroupOverview.module.css';

import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Heading';
import Skeleton from '@/components/atoms/Skeleton';
import Modal from '@/components/molecules/Modal';
import Avatar from '@/components/organisms/Avatar';
import AvatarList from '@/components/organisms/AvatarList';

import { useGroupProfile } from '@/features';
import { useGroup } from '@/hooks';
import { authUserAtom } from '@/store';
import { getFirebaseError } from '@/utils';

export interface GroupProps {
  groupId: string;
}

const GroupOverview = ({ groupId }: GroupProps) => {
  const [authUser] = useAtom(authUserAtom);
  const [errorMessage, setErrorMessage] = useState(
    '予期せぬエラーが発生しました。お手数ですが、再度ログインしてください。'
  );
  const [isOpenErrorModal, setIsOpenErrorModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [groupName, setGroupName] = useState('');
  const [groupIconUrl, setGroupIconUrl] = useState('');
  const [groupAuthorId, setGroupAuthorId] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const { getGroupMemberList, saveGroupMemberData, memberList } =
    useGroupProfile();

  const { saveGroupsMemberIdList, getGroups } = useGroup();

  const navigate = useNavigate();
  const userId = authUser?.uid;

  const getGroupMember = async () => {
    if (!groupId) return;

    const groupMemberIdList = await getGroupMemberList(groupId, true);
    await saveGroupMemberData(groupMemberIdList);

    const groupData = await getGroups(groupId);

    if (groupData) {
      setGroupIconUrl(groupData.iconUrl);
      setGroupName(groupData.name);
      setGroupAuthorId(groupData.authorId);
    }
    saveGroupsMemberIdList(groupId, groupMemberIdList);
  };

  useEffect(() => {
    try {
      getGroupMember();
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
  }, [groupId]);

  const scrollRefCurrent = scrollRef.current;
  const isPcWindow = window.matchMedia('(min-width:1024px)').matches;

  const handleScroll = async () => {
    if (!groupId) return;
    if (!scrollRefCurrent) return;

    let contentsHeight;
    if (isPcWindow) {
      contentsHeight = window.innerHeight - 262;
    } else {
      contentsHeight = window.innerHeight - 278;
    }

    if (
      scrollRefCurrent.scrollHeight !==
      scrollRefCurrent.scrollTop + contentsHeight
    )
      return;

    getGroupMemberList(groupId, false).then((groupMemberIdList) => {
      saveGroupMemberData(groupMemberIdList);
      saveGroupsMemberIdList(groupId, groupMemberIdList);
    });
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

  const showEditButton = () => {
    if (groupAuthorId === userId) {
      return (
        <Button
          color="primary"
          onClick={() => navigate(`/group/${groupId}/edit`)}
          variant="outlined"
          isFullWidth
          size={isPcWindow ? 'medium' : 'small'}
        >
          編集
        </Button>
      );
    }
  };
  return (
    <>
      {renderErrorModal()}
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
          <div className={`${styles.groupProfile} inner`}>
            <Avatar iconUrl={groupIconUrl} isNotUpload uploadIconSize="l" />
            <Heading tag="h2" align="center" isBold size="l">
              <span>{groupName}</span>
              <span>{`(${memberList.length})`}</span>
            </Heading>
          </div>
          <div ref={scrollRef} className={styles.contents}>
            <AvatarList idList={memberList} />
          </div>
          <div className={`${styles.buttonArea} flex alic fdrc inner`}>
            <Button
              color="primary"
              onClick={() => navigate(`/rooms/${groupId}/message`)}
              variant="contained"
              isFullWidth
              size={isPcWindow ? 'medium' : 'small'}
            >
              トーク
            </Button>
            {showEditButton()}
          </div>
        </div>
      )}
    </>
  );
};

export default GroupOverview;
