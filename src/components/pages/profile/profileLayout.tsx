import { Outlet } from 'react-router-dom';

import BottomNavigation from '@/components/organisms/BottomNavigation';
import ProfileOverview from '@/components/organisms/ProfileOverview';

const ProfileLayout = () => {
  return (
    <>
      <div className="sp">
        <Outlet />
        <BottomNavigation />
      </div>
      <div className="pc flex fullWidth">
        <ProfileOverview />
        <Outlet />
      </div>
    </>
  );
};

export default ProfileLayout;
