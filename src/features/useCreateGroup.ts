import { useState } from 'react';

export interface InitialGroupData {
  groupName: string;
  groupIconUrl: string;
}
export interface JoinedRoomsDataObject {
  anotherId: string;
  type: string;
  isVisible: boolean;
}
export const useCreateGroup = () => {
  const [groupName, setGroupName] = useState('');

  const isComplete = () => {
    if (!groupName) return false;

    return true;
  };

  return {
    groupName,
    setGroupName,
    isComplete,
  };
};
