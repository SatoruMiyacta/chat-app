import { useParams } from 'react-router-dom';

import Header from '@/components/organisms/Header';
import MessageForm from '@/components/organisms/MessageForm';

const Message = () => {
  const { postId } = useParams();

  return (
    <>
      <Header title="トーク" className="sp" showBackButton />
      {postId && <MessageForm postId={postId} />}
    </>
  );
};
export default Message;
