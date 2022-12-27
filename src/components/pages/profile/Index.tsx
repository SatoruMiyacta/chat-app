import BottomNavigation from '../../organisms/BottomNavigation';
import Header, { ActionItem } from '../../organisms/Header';

const Profile = () => {
  return (
    <>
      <Header title="プロフィール" isSticky />
      <BottomNavigation />
    </>
  );
};

export default Profile;
