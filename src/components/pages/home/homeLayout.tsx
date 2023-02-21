import { Outlet } from 'react-router-dom';

import Header from '@/components/organisms/Header';
import SideMenu from '@/components/organisms/SideMenu';

interface HomeLayoutProps {
  children?: React.ReactNode;
}
const HomeLayout = ({ children }: HomeLayoutProps) => {
  return (
    <>
      <div className="sp">{children}</div>
      <div className="pc">{children}</div>
    </>
  );
};

export default HomeLayout;
