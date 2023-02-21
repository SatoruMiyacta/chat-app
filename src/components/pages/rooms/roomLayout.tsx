import { Outlet } from 'react-router-dom';

import BottomNavigation from '@/components/organisms/BottomNavigation';

interface RoomLayoutProps {
  children?: React.ReactNode;
}
const RoomLayout = ({ children }: RoomLayoutProps) => {
  return (
    <>
      <div className="sp">
        {children}
        <BottomNavigation />
      </div>
      <div className="pc flex fullWidth">{children}</div>
    </>
  );
};

export default RoomLayout;
