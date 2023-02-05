import { useAtom } from 'jotai';

import { groupsAtom, usersAtom, GroupData } from '@/store';
import {
  getCacheExpirationDate,
  fetchGroupsData,
  isGroupCacheActive,
} from '@/utils';

export const useGroup = () => {
  const [groups, setGroups] = useAtom(groupsAtom);

  /**
   * グループデータのキャッシュが古くないか
   * キャッシュが新しければグローバルstateからデータ取得。
   * 古ければfirestoreから取得
   */
  const getGroups = async (groupId: string) => {
    if (isGroupCacheActive(groups[groupId])) return groups[groupId].data;

    const groupsData = await fetchGroupsData(groupId);
    if (!groupsData) return;

    return groupsData;
  };

  /**
   * グローバルstateの情報を更新
   */
  const saveGroups = (groupId: string, groupsData: GroupData) => {
    setGroups((prevState) => ({
      ...prevState,
      [groupId]: { data: groupsData, expiresIn: getCacheExpirationDate() },
    }));
  };

  return { getGroups, saveGroups };
};
