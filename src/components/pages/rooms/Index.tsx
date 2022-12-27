import BottomNavigation from '../../organisms/BottomNavigation';
import Header, { ActionItem } from '../../organisms/Header';

const Rooms = () => {
  return (
    <>
      <Header title="トーク" isSticky />
      <BottomNavigation />
    </>
  );
};

export default Rooms;
