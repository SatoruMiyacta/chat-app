import { useParams } from 'react-router-dom';

import GroupOverview from '@/components/organisms/GroupOverview';
import Header from '@/components/organisms/Header';

const GroupProfile = () => {
  const { postId } = useParams();
  return (
    <>
      <Header title="グループプロフィール" className="sp" showBackButton />
      <main>{postId && <GroupOverview groupId={postId} />}</main>
    </>
  );
};

export default GroupProfile;
