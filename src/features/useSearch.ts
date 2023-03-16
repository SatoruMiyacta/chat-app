import { useUser } from '@/hooks';

export const useSearch = () => {
  const { getUser, saveUser, getSearchedFriends, getSearchedUser } = useUser();

  // 検索したユーザー一覧をグローバルステートに保存して、一覧を返す
  const searchUserList = async (search: string) => {
    const searchList = await getSearchedUser(search);

    for (const searchId of searchList) {
      const userData = await getUser(searchId);

      if (userData) saveUser(searchId, userData);
    }

    return searchList;
  };

  const convertnotFriendsObject = async (
    searchList: string[],
    userId: string
  ) => {
    const searchedFriendsIdList = await getSearchedFriends(searchList, userId);

    if (!searchedFriendsIdList) return;

    const notFriends = searchList.filter(
      (i) => searchedFriendsIdList.indexOf(i) == -1
    );
    const notFriendsObject = notFriends.reduce((accumulater, value) => {
      return { ...accumulater, [value]: true };
    }, {});

    return notFriendsObject;
  };

  return { convertnotFriendsObject, searchUserList };
};
