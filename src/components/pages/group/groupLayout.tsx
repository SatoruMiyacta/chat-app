import { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';

import BottomNavigation from '@/components/organisms/BottomNavigation';

interface GroupLayoutProps {
  children: React.ReactNode;
}

const GroupLayout = ({ children }: GroupLayoutProps) => {
  return (
    <>
      <div className="sp">{children}</div>
      <div className="pc flex">{children}</div>
    </>
  );
};

export default GroupLayout;
