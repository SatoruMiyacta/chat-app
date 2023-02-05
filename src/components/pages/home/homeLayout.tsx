import { Outlet } from 'react-router-dom';

import BottomNavigation from '@/components/organisms/BottomNavigation';
import Header from '@/components/organisms/Header';
import SideMenu from '@/components/organisms/SideMenu';

const HomeLayout = () => {
  return (
    <>
      <div className="sp">
        <Outlet />
        <BottomNavigation />
      </div>
      <div className="pc">
        <Outlet />
      </div>
    </>
  );
};

export default HomeLayout;
