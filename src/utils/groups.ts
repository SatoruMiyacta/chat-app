import { doc, getDoc } from 'firebase/firestore';

import { db } from '@/main';
import { GroupData } from '@/store';
import { GroupCacheObject } from '@/store';

/**
 * firestoreから該当のグループ情報を取得する
 */
export const fetchGroupsData = async (groupId: string) => {
  const docRef = doc(db, 'groups', groupId);
  const docSnap = await getDoc(docRef);
  const data = docSnap.data();
  if (!data) return;

  const groupData: GroupData = {
    authorId: data.authorId,
    name: data.name,
    iconUrl: data.iconUrl,
    createdAt: data.createdAt.toDate(),
    updatedAt: data.updatedAt.toDate(),
  };

  return groupData;
};

export const isGroupCacheActive = (groupsObject: GroupCacheObject) => {
  const now = new Date();
  const isCacheActive = groupsObject?.expiresIn > now;
  return isCacheActive;
};
