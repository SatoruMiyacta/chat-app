import { Outlet } from 'react-router-dom';

import Message from '../rooms/message';

import BottomNavigation from '@/components/organisms/BottomNavigation';
import SideMenu from '@/components/organisms/SideMenu';

const ProfileLayout = () => {
  return (
    <>
      <div className="sp">
        <Outlet />
        <BottomNavigation />
      </div>
      <div style={{ display: 'flex' }} className="pc">
        <SideMenu />
        <Outlet />
      </div>
    </>
  );
};

export default ProfileLayout;
