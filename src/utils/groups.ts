import {
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  query,
  limit,
  setDoc,
  Transaction,
  WriteBatch,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

import { InitialGroupData } from '@/features';
import { UserAndGroupId } from '@/hooks';
import { db, storage } from '@/main';
import { GroupData } from '@/store';

/**
 * storageにアバターを保存し、URLを取得する。
 */
export const uploadIcon = async (groupIconFile: Blob, groupId: string) => {
  if (!groupIconFile) throw new Error('画像をアップロードしてください。');

  const storageRef = ref(storage, `iconImage/groups/${groupId}/groupIcon`);
  await uploadBytes(storageRef, groupIconFile);
  const url = await getDownloadURL(storageRef);

  return url;
};

/**
 * firestoreから該当のグループ情報を取得する
 */

export const fetchGroupsData = async (
  groupId: string,
  transaction?: Transaction
) => {
  const docRef = doc(db, 'groups', groupId);

  let docSnap;
  if (!transaction) {
    docSnap = await getDoc(docRef);
  } else {
    docSnap = await transaction.get(docRef);
  }

  const data = docSnap?.data();
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
  // const querySnapshot = await getDocs(query(groupsRef, limit(10)));
  return querySnapshot;
};

/**
 * firestoreに該当のグループ情報を作成し、グループIDを返す
 */
export const setGroupsData = async (
  { userId, groupId }: UserAndGroupId,
  { groupName, groupIconUrl }: InitialGroupData,
  batch: WriteBatch
) => {
  const docRef = doc(db, 'groups', groupId);
  batch.set(docRef, {
    authorId: userId,
    name: groupName,
    iconUrl: groupIconUrl,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

/**
 * 自分のjoinedGroupsにグループ情報を作成
 */
export const setMyJoinedGroups = async (
  { userId, groupId }: UserAndGroupId,
  batch?: WriteBatch
) => {
  if (!userId) return;

  const docRef = doc(db, 'users', userId, 'joinedGroups', groupId);
  if (batch) {
    batch.set(docRef, {
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } else {
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
  { userId, groupId }: UserAndGroupId,
  batch?: WriteBatch
) => {
  const newgroupMemberIdList = [...groupMemberIdList];
  if (userId) newgroupMemberIdList.push(userId);

  for (const memberId of newgroupMemberIdList) {
    const docRef = doc(db, 'groups', groupId, 'members', memberId);

    if (batch) {
      batch.set(docRef, {
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      await setDoc(docRef, {
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
  }
};

/**
 * グループメンバーをサブコレクションのmembersに登録
 */
export const updateGroupsMember = async (
  groupId: string,
  groupMemberIdList: string[],
  batch?: WriteBatch
) => {
  for (const memberId of groupMemberIdList) {
    const docRef = doc(db, 'groups', groupId, 'members', memberId);

    if (batch) {
      batch.update(docRef, {
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      await updateDoc(docRef, {
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
  }
};

/**
 * グループメンバーをサブコレクションのmembersから取得
 */
export const fetchGroupsMember = async (groupId: string) => {
  const collectionRef = collection(db, 'groups', groupId, 'members');
  const querySnapshot = await getDocs(collectionRef);

  return querySnapshot;
};

/**
 * グループメンバーから該当メンバーを消す
 */
export const deleteGroupMember = async (groupId: string, memberId: string) => {
  const docRef = doc(db, 'groups', groupId, 'members', memberId);
  await deleteDoc(docRef);
};

/**
 * 該当のグループをjoinedGroupsから消す
 */
export const deleteJoinedGroups = async (userId: string, groupId: string) => {
  const docRef = doc(db, 'users', userId, 'joinedGroups', groupId);
  await deleteDoc(docRef);
};
