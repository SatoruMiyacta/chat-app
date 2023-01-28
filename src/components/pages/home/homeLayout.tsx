import { Outlet } from 'react-router-dom';

import BottomNavigation from '@/components/organisms/BottomNavigation';
import Header from '@/components/organisms/Header';
import SideMenu from '@/components/organisms/SideMenu';

const HomeLayout = () => {
  return (
    <div>
      <Outlet />
      <BottomNavigation />
    </div>
  );
};

export default HomeLayout;
