import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAtom } from 'jotai';

import Button, { ButtonProps } from '../atoms/Button';
import Checkbox, { CheckboxProps } from '../atoms/Checkbox';

import Avatar, { AvatarProps } from './Avatar';
import styles from './AvatarList.module.css';

import {
  faCircleUser,
  faComment,
  faUserPlus,
  faBan,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Heading, { HeadingProps } from '@/components/atoms/Heading';
import Modal from '@/components/molecules/Modal';

import { usersAtom, authUserAtom, UserData, groupsAtom } from '@/store';
import { setFriend } from '@/utils';

export interface AvatarListProps {
  idList: string[];
  batch?: IdObject;
  checkboxItems?: IdObject;
  isGroup?: boolean;
  lastMessage?: string;
  onChange?: CheckboxProps['onChange'];
  onClick?: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    index: number
  ) => void;
  showCheckbox?: boolean;
  showDeleteButton?: boolean;
}

export interface IdObject {
  [id: string]: boolean;
}

const AvatarList = ({
  idList,
  batch,
  checkboxItems,
  isGroup = false,
  lastMessage,
  onChange,
  onClick,
  showCheckbox = false,
  showDeleteButton = false,
}: AvatarListProps) => {
  const [users, setUsers] = useAtom(usersAtom);
  const [authUser] = useAtom(authUserAtom);
  const [groups, setGroups] = useAtom(groupsAtom);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [modalAvatarUrl, setModalAvatarUrl] = useState('');
  const [modalAvatarname, setModalAvatarname] = useState('');
  const [modalAvatarId, setModalAvatarId] = useState('');

  const userId = authUser?.uid;

  const navigate = useNavigate();

  const showAvatarModal = (listId: string) => {
    if (showCheckbox || showDeleteButton) return;

    let modalAvatar = users[listId]?.data;

    if (isGroup) modalAvatar = groups[listId].data;

    setModalAvatarUrl(modalAvatar.iconUrl);
    setModalAvatarname(modalAvatar.name);
    setModalAvatarId(listId);
    setIsOpenModal(true);
  };

  const addFriend = async () => {
    if (!userId) return;

    await setFriend(userId, modalAvatarId);
    // navigate('/room');
  };

  const renderUserModal = () => {
    if (!isOpenModal) return;

    return (
      <div className={styles.modal}>
        <Modal
          onClose={() => setIsOpenModal(false)}
          hasInner
          isOpen={isOpenModal}
        >
          <div className={styles.avatarArea}>
            <Avatar
              iconUrl={modalAvatarUrl}
              isNotUpload
              uploadIconSize="large"
            />
            <Heading tag="h1" align="center" size="xl">
              {modalAvatarname}
            </Heading>
          </div>
          <div className={styles.controler}>
            {batch && !batch[modalAvatarId] && (
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
                <button>
                  <Link to={'/rooms'}>
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
            {batch && batch[modalAvatarId] && (
              <>
                <button onClick={addFriend}>
                  <Link to={'/search'}>
                    <FontAwesomeIcon
                      icon={faUserPlus}
                      style={{ marginBottom: '4px' }}
                      size={'xl'}
                    />
                    友達追加
                  </Link>
                </button>
                <button>
                  <Link to={'/rooms'}>
                    <FontAwesomeIcon
                      icon={faBan}
                      style={{ marginBottom: '4px' }}
                      size={'xl'}
                    />
                    ブロック
                  </Link>
                </button>
              </>
            )}
          </div>
        </Modal>
      </div>
    );
  };

  const oneLineClassNameList = [styles.oneLine];
  if (lastMessage) oneLineClassNameList.push(styles.lastMessage);

  const buttonStyles: React.CSSProperties = { pointerEvents: 'auto' };
  if (showCheckbox || showDeleteButton) buttonStyles.pointerEvents = 'none';

  return (
    <>
      {renderUserModal()}
      <div className={styles.list}>
        <ul>
          {idList.map((id, index) => (
            <li
              key={`list-${id}${index}`}
              className={`${oneLineClassNameList.join(' ')} flex alic inner`}
            >
              <button
                className="flex alic"
                style={buttonStyles}
                onClick={() => showAvatarModal(id)}
                type="button"
              >
                {!isGroup && userId && users[id] && (
                  <>
                    <Avatar
                      iconUrl={users[id].data.iconUrl}
                      uploadIconSize="small"
                      isNotUpload
                    />
                    <Heading tag="h1">{users[id].data.name}</Heading>{' '}
                    <p>{lastMessage}</p>
                  </>
                )}
                {isGroup && userId && groups[id] && (
                  <>
                    <Avatar
                      iconUrl={groups[id].data.iconUrl}
                      uploadIconSize="small"
                      isNotUpload
                    />
                    <Heading tag="h1">{groups[id].data.name}</Heading>{' '}
                    <p>{lastMessage}</p>
                  </>
                )}
              </button>
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
                  <button
                    onClick={(event) => {
                      onClick(event, index);
                    }}
                  >
                    削除
                  </button>
                )}
                {batch && batch[id] && (
                  <FontAwesomeIcon
                    icon={faUserPlus}
                    style={{ marginBottom: '4px' }}
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
