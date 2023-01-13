import { Outlet } from 'react-router-dom';

import BottomNavigation from '@/components/organisms/BottomNavigation';

const ProfileLayout = () => {
  return (
    <>
      <Outlet />
      <BottomNavigation />
    </>
  );
};

export default ProfileLayout;
