import {
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  query,
  orderBy,
  limit,
  setDoc,
  addDoc,
} from 'firebase/firestore';

import { InitialGroupData } from '@/features';
import { db } from '@/main';
import { GroupData, GroupCacheObject, CacheObject } from '@/store';
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

/**
 * ユーザーgroupデータ一覧をfirestoreから取得
 */
export const fetchUserGroupsData = async (userId: string) => {
  const groupsRef = collection(db, 'users', userId, 'joinedGroups');
  const querySnapshot = await getDocs(query(groupsRef, limit(10)));
  return querySnapshot;
};

/**
 * firestoreに該当のグループ情報を作成し、グループIDを返す
 */
export const addGroupsData = async (
  authorId: string,
  { groupName, groupIconUrl }: InitialGroupData
) => {
  const docRef = collection(db, 'groups');
  const querySnapshot = await addDoc(docRef, {
    authorId: authorId,
    name: groupName,
    iconUrl: groupIconUrl,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  const groupId = querySnapshot.id;

  return groupId;
};

/**
 * グループメンバー全員のjoinedGroupsにグループ情報を作成
 */
export const setDataToJoinedGroups = async (
  groupMemberIdList: string[],
  groupId: string,
  userId: string
) => {
  const newgroupMemberIdList = [...groupMemberIdList];
  newgroupMemberIdList.push(userId);

  for (const memberId of newgroupMemberIdList) {
    const docRef = doc(db, 'users', memberId, 'joinedGroups', groupId);
    await setDoc(docRef, {
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
};

/**
 * グループメンバーをサブコレクションのmembersに登録
 */
export const setGroupsMember = async (
  groupMemberIdList: string[],
  groupId: string,
  userId: string
) => {
  const newgroupMemberIdList = [...groupMemberIdList];
  newgroupMemberIdList.push(userId);

  for (const userId of newgroupMemberIdList) {
    const docRef = doc(db, 'groups', groupId, 'members', userId);
    await setDoc(docRef, {
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
};
