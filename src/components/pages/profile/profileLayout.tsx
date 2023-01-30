import { Outlet } from 'react-router-dom';

import BottomNavigation from '@/components/organisms/BottomNavigation';
import ProfileOverview from '@/components/organisms/profileOverview';

const ProfileLayout = () => {
  return (
    <>
      <div className="sp">
        <Outlet />
        <BottomNavigation />
      </div>
      <div className="pc">
        <ProfileOverview />
        <Outlet />
      </div>
    </>
  );
};

export default ProfileLayout;
