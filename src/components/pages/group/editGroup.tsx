import { useParams } from 'react-router-dom';

import EditGroupOverview from '@/components/organisms/EditGroupOverView';
import Header from '@/components/organisms/Header';

const EditGroup = () => {
  const { postId } = useParams();

  return (
    <>
      <Header title="グループ編集" className="sp" showBackButton />
      <main>{postId && <EditGroupOverview groupId={postId} />}</main>
    </>
  );
};

export default EditGroup;
