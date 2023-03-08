import { useParams, useLocation } from 'react-router-dom';

import Search from '../home/search';

import styles from './index.module.css';

import Header from '@/components/organisms/Header';
import HomeOverview from '@/components/organisms/HomeOverview';
import UsersOverview from '@/components/organisms/UserOverview';

const Users = () => {
  const { postId } = useParams();
  const location = useLocation();

  const showOverview = () => {
    if (!postId) return;

    const beforeLocation = location.state;

    if (beforeLocation.beforePath === '/') {
      return (
        <>
          <HomeOverview />
          <UsersOverview userId={postId} />
        </>
      );
    } else if (beforeLocation.beforePath === '/search') {
      return (
        <>
          <Search />
          <UsersOverview userId={postId} />
        </>
      );
    }
  };

  const isPcWindow = window.matchMedia('(min-width:1024px)').matches;
  return (
    <>
      <Header title="プロフィール" className="sp" showBackButton />
      <main className={`${styles.container}`}>
        {!isPcWindow && postId && <UsersOverview userId={postId} />}
        {isPcWindow && postId && <div className="flex">{showOverview()}</div>}
      </main>
    </>
  );
};

export default Users;
