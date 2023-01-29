import { Outlet } from 'react-router-dom';

import Message from '../rooms/message';

import PcProfile from './pcIndex';

import BottomNavigation from '@/components/organisms/BottomNavigation';
import SideMenu from '@/components/organisms/SideMenu';

const ProfileLayout = () => {
  return (
    <>
      <div className="sp">
        <Outlet />
        <BottomNavigation />
      </div>
      <div className="pc">
        <PcProfile />
        <Outlet />
      </div>
    </>
  );
};

export default ProfileLayout;
