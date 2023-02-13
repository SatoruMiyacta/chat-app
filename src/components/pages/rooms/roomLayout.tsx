import { Outlet } from 'react-router-dom';

import BottomNavigation from '@/components/organisms/BottomNavigation';

const RoomLayout = () => {
  return (
    <>
      <div className="sp">
        <Outlet />
        <BottomNavigation />
      </div>
      <div className="pc flex fullWidth">
        <Outlet />
      </div>
    </>
  );
};

export default RoomLayout;
