import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { useAtom } from 'jotai';

import Checkbox, { CheckboxProps } from '../atoms/Checkbox';

import Avatar from './Avatar';
import styles from './AvatarList.module.css';

import {
  faCircleUser,
  faComment,
  faUserPlus,
  faEllipsisVertical,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Heading from '@/components/atoms/Heading';
import Menu, { MenuItem } from '@/components/molecules/Menu';
import Modal from '@/components/molecules/Modal';

import { JoinedRoomsObject } from '@/features';
import { usersAtom, authUserAtom, groupsAtom } from '@/store';

export interface IdObject {
  [id: string]: boolean;
}

export interface CountObject {
  [id: string]: number;
}

export interface MenuObject {
  [id: string]: MenuItem[];
}

export interface AvatarListProps {
  idList: string[];
  addFriend?: (id: string) => void;
  batchIdObject?: IdObject;
  checkboxItems?: IdObject;
  isBlockUser?: boolean;
  joinedRoomsObject?: JoinedRoomsObject;
  lastMessage?: string;
  menuItems?: MenuObject;
  onChange?: CheckboxProps['onChange'];
  onClick?: (index: number) => void;
  showCheckbox?: boolean;
  showDeleteButton?: boolean;
  unReadCount?: CountObject;
}

const AvatarList = ({
  idList,
  addFriend,
  batchIdObject,
  checkboxItems,
  isBlockUser,
  joinedRoomsObject,
  lastMessage,
  menuItems,
  onChange,
  onClick,
  showCheckbox = false,
  showDeleteButton = false,
  unReadCount,
}: AvatarListProps) => {
  const [users] = useAtom(usersAtom);
  const [authUser] = useAtom(authUserAtom);
  const [groups] = useAtom(groupsAtom);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [modalAvatarUrl, setModalAvatarUrl] = useState('');
  const [modalAvatarname, setModalAvatarname] = useState('');
  const [modalAvatarId, setModalAvatarId] = useState('');

  const userId = authUser?.uid;

  const navigate = useNavigate();
  const location = useLocation();

  const showAvatarModal = async (listId: string) => {
    if (showCheckbox || showDeleteButton) return;

    let modalAvatar;

    if (users[listId]) {
      modalAvatar = users[listId].data;
    } else if (groups[listId]) {
      modalAvatar = groups[listId].data;
    }

    if (!modalAvatar) return;

    setModalAvatarUrl(modalAvatar.iconUrl);
    setModalAvatarname(modalAvatar.name);
    setModalAvatarId(listId);
    setIsOpenModal(true);
  };

  const navigateUserPath = (id: string) => {
    const currentLocation = location.pathname;
    let navigationPath = '';
    if (currentLocation === '/') {
      navigationPath = `/?userId=${id}`;
    } else if (currentLocation === '/search') {
      navigationPath = `/search?userId=${id}`;
    } else if (currentLocation === '/block') {
      navigationPath = `/block?userId=${id}`;
    }

    return navigationPath;
  };

  const navigateGroupPath = (id: string) => {
    const currentLocation = location.pathname;
    let navigationPath = '';
    if (currentLocation === '/') {
      navigationPath = `/?groupId=${id}`;
    } else if (currentLocation === '/search') {
      navigationPath = `/search?groupId=${id}`;
    } else if (currentLocation === '/block') {
      navigationPath = `/block?groupId=${id}`;
    }

    return navigationPath;
  };

  const navigateModalPath = (id: string) => {
    if (isPcWindow) {
      const navigationPath = navigateUserPath(id);

      return navigationPath;
    } else {
      let path = `/users/${id}`;
      if (groups[id]) path = `/group/${id}/profile`;

      return path;
    }
  };

  const renderUserModal = () => {
    if (!isOpenModal) return;
    if (!userId) return;

    return (
      <div className={styles.modal}>
        <Modal
          onClose={() => setIsOpenModal(false)}
          hasInner
          isOpen={isOpenModal}
        >
          <div className={styles.avatarArea}>
            <Avatar iconUrl={modalAvatarUrl} isNotUpload uploadIconSize="l" />
            <Heading tag="h1" align="center" size="xl">
              {modalAvatarname}
            </Heading>
          </div>
          <div className={styles.controler}>
            {!batchIdObject && (
              <>
                <button>
                  <Link to={'/rooms'}>
                    <FontAwesomeIcon
                      icon={faComment}
                      style={{ marginBottom: '4px' }}
                      size={'xl'}
                    />
                    トーク
                  </Link>
                </button>
                <button onClick={() => setIsOpenModal(false)}>
                  <Link to={navigateModalPath(modalAvatarId)}>
                    <FontAwesomeIcon
                      icon={faCircleUser}
                      style={{ marginBottom: '4px' }}
                      size={'xl'}
                    />
                    プロフィール
                  </Link>
                </button>
              </>
            )}
            {batchIdObject && !batchIdObject[modalAvatarId] && (
              <>
                <button>
                  <Link to={'/rooms'}>
                    <FontAwesomeIcon
                      icon={faComment}
                      style={{ marginBottom: '4px' }}
                      size={'xl'}
                    />
                    トーク
                  </Link>
                </button>
                <button onClick={() => setIsOpenModal(false)}>
                  <Link to={navigateModalPath(modalAvatarId)}>
                    <FontAwesomeIcon
                      icon={faCircleUser}
                      style={{ marginBottom: '4px' }}
                      size={'xl'}
                    />
                    プロフィール
                  </Link>
                </button>
              </>
            )}
            {batchIdObject && batchIdObject[modalAvatarId] && addFriend && (
              <>
                <button
                  onClick={() => {
                    addFriend(modalAvatarId);
                    setIsOpenModal(false);
                  }}
                >
                  <Link to={'/search'}>
                    <FontAwesomeIcon
                      icon={faUserPlus}
                      style={{ marginBottom: '4px' }}
                      size={'xl'}
                    />
                    友達追加
                  </Link>
                </button>
                <button onClick={() => setIsOpenModal(false)}>
                  <Link to={navigateModalPath(modalAvatarId)}>
                    <FontAwesomeIcon
                      icon={faCircleUser}
                      style={{ marginBottom: '4px' }}
                      size={'xl'}
                    />
                    プロフィール
                  </Link>
                </button>
              </>
            )}
          </div>
        </Modal>
      </div>
    );
  };

  const isPcWindow = window.matchMedia('(min-width:1024px)').matches;
  const showAvatarList = (id: string) => {
    const onClickUser = () => {
      if (isPcWindow) {
        return navigate(navigateUserPath(id));
      } else {
        return showAvatarModal(id);
      }
    };

    const onClickGroup = () => {
      if (isPcWindow) {
        return navigate(navigateGroupPath(id));
      } else {
        return showAvatarModal(id);
      }
    };

    if (
      typeof joinedRoomsObject !== 'undefined' &&
      Object.keys(joinedRoomsObject).length !== 0
    ) {
      if (!joinedRoomsObject[id]) return;
      if (joinedRoomsObject[id].isVisible === false) return;

      const roomType = joinedRoomsObject[id].type;
      const roomTypeId = joinedRoomsObject[id].id;

      return (
        <>
          {roomType === 'user' && users[roomTypeId] && (
            <button
              className="flex alic"
              style={buttonStyles}
              onClick={() => navigate(`/rooms/${id}/message`)}
              type="button"
            >
              <Avatar
                iconUrl={users[roomTypeId].data.iconUrl}
                uploadIconSize="s"
                isNotUpload
              />
              <Heading tag="h1">{users[roomTypeId].data.name}</Heading>
              {lastMessage}
            </button>
          )}
          {roomType === 'group' && groups[roomTypeId] && (
            <button
              className="flex alic"
              style={buttonStyles}
              onClick={() => navigate(`/rooms/${id}/message`)}
              type="button"
            >
              <Avatar
                iconUrl={groups[roomTypeId].data.iconUrl}
                uploadIconSize="s"
                isNotUpload
              />
              <Heading tag="h1">{groups[roomTypeId].data.name}</Heading>
              {lastMessage}
            </button>
          )}
        </>
      );
    } else {
      return (
        <>
          {users[id] && (
            <button
              className="flex alic"
              style={buttonStyles}
              onClick={onClickUser}
              type="button"
            >
              <Avatar
                iconUrl={users[id].data.iconUrl}
                uploadIconSize="s"
                isNotUpload
              />
              <Heading tag="h1">{users[id].data.name}</Heading>
            </button>
          )}
          {groups[id] && (
            <button
              className="flex alic"
              style={buttonStyles}
              onClick={onClickGroup}
              type="button"
            >
              <Avatar
                iconUrl={groups[id].data.iconUrl}
                uploadIconSize="s"
                isNotUpload
              />
              <Heading tag="h1">{groups[id].data.name}</Heading>
            </button>
          )}
        </>
      );
    }
  };

  const getActiveClass = (id: string) => {
    if (location.pathname === `/rooms/${id}/message`) {
      return styles.active;
    } else if (location.pathname === `/users/${id}`) {
      return styles.active;
    } else if (location.pathname === `/group/${id}/profile`) {
      return styles.active;
    }
  };

  const buttonStyles: React.CSSProperties = { pointerEvents: 'auto' };
  if (showCheckbox || (showDeleteButton && !isBlockUser))
    buttonStyles.pointerEvents = 'none';

  const oneLineClassNameList = [styles.oneLine];
  if (joinedRoomsObject) oneLineClassNameList.push(styles.roomList);

  return (
    <>
      {renderUserModal()}
      <div className={styles.list}>
        <ul>
          {idList &&
            idList.length !== 0 &&
            idList.map((id, index) => (
              <li
                key={`list-${id}${index}`}
                className={`${oneLineClassNameList.join(' ')} ${getActiveClass(
                  id
                )} flex alic inner`}
              >
                {showAvatarList(id)}
                <div className={`${styles.filterArea} flex alic`}>
                  {showCheckbox && onChange && checkboxItems && (
                    <Checkbox
                      color="primary"
                      onChange={onChange}
                      id={id}
                      isChecked={checkboxItems[id]}
                      size="small"
                    />
                  )}
                  {showDeleteButton && onClick && (
                    <button onClick={() => onClick(index)}>
                      {isBlockUser ? '解除' : '削除'}
                    </button>
                  )}
                  {batchIdObject && batchIdObject[id] && (
                    <button onClick={() => showAvatarModal(id)}>
                      <FontAwesomeIcon
                        icon={faUserPlus}
                        style={{ marginBottom: '4px' }}
                      />
                    </button>
                  )}
                  {unReadCount && unReadCount[id] > 0 && (
                    <span>{unReadCount[id]}</span>
                  )}
                  {menuItems && menuItems[id] && (
                    <Menu
                      items={menuItems[id]}
                      buttonChildren={
                        <FontAwesomeIcon icon={faEllipsisVertical} />
                      }
                    />
                  )}
                </div>
              </li>
            ))}
        </ul>
      </div>
    </>
  );
};
export default AvatarList;
