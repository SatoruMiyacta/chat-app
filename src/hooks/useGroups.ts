import { useAtom } from 'jotai';

import { groupsAtom, usersAtom, GroupData } from '@/store';
import {
  getCacheExpirationDate,
  fetchGroupsData,
  isGroupCacheActive,
} from '@/utils';

export const useGroup = () => {
  const [groups, setGroups] = useAtom(groupsAtom);

  const getGroups = async (groupId: string) => {
    if (isGroupCacheActive(groups[groupId])) return groups[groupId].data;

    const groupsData = await fetchGroupsData(groupId);
    if (!groupsData) return;

    return groupsData;
  };

  const saveGroups = (groupId: string, groupsData: GroupData) => {
    setGroups((prevState) => ({
      ...prevState,
      [groupId]: { data: groupsData, expiresIn: getCacheExpirationDate() },
    }));
  };

  return { getGroups, saveGroups };
};
