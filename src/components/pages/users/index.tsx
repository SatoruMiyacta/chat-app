import { useParams, useLocation, useNavigate } from 'react-router-dom';

import { useAtom } from 'jotai';

import Search from '../home/search';

import styles from './index.module.css';

import Header from '@/components/organisms/Header';
import HomeOverview from '@/components/organisms/HomeOverview';
import UsersOverview from '@/components/organisms/UserOverview';

import { authUserAtom } from '@/store';

const Users = () => {
  const { postId } = useParams();

  return (
    <>
      <Header title="プロフィール" className="sp" showBackButton />
      <main className={`${styles.container}`}>
        {postId && <UsersOverview userId={postId} />}
      </main>
    </>
  );
};

export default Users;
