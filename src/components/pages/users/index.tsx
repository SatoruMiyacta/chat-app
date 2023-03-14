import { useParams } from 'react-router-dom';

import styles from './index.module.css';

import Header from '@/components/organisms/Header';
import UsersOverview from '@/components/organisms/UserOverview';

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
