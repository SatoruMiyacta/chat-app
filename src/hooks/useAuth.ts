import { useSetAtom } from 'jotai';

import {
  authUserAtom,
  friendsIdAtom,
  usersAtom,
  blockUserIdAtom,
  roomsAtom,
  joinedRoomsAtom,
  joinedRoomListAtom,
  messagesAtom,
  messagesListAtom,
  groupsAtom,
  joinedGroupsAtom,
  groupsMemberAtom,
} from '@/store';

export const useAuth = () => {
  const setAuthUser = useSetAtom(authUserAtom);
  const setFriends = useSetAtom(friendsIdAtom);
  const setUsers = useSetAtom(usersAtom);
  const setBlockUser = useSetAtom(blockUserIdAtom);
  const setRooms = useSetAtom(roomsAtom);
  const setJoinedRooms = useSetAtom(joinedRoomsAtom);
  const setJoinedRoomsList = useSetAtom(joinedRoomListAtom);
  const setMessages = useSetAtom(messagesAtom);
  const setMessageList = useSetAtom(messagesListAtom);
  const setGroups = useSetAtom(groupsAtom);
  const setJoinedGroups = useSetAtom(joinedGroupsAtom);
  const setGroupMember = useSetAtom(groupsMemberAtom);

  const resetCache = () => {
    setAuthUser(null);
    setUsers({});
    setFriends(null);
    setBlockUser(null);
    setRooms({});
    setJoinedRooms({});
    setJoinedRoomsList(null);
    setMessages({});
    setMessageList(null);
    setGroups({});
    setJoinedGroups(null);
    setGroupMember({});
  };
  return { resetCache };
};
