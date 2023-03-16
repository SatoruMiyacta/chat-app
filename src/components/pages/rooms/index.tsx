import BottomNavigation from '@/components/organisms/BottomNavigation';
import Header from '@/components/organisms/Header';
import PcNavigation from '@/components/organisms/PcNavigation';
import RoomOverview from '@/components/organisms/RoomOverview';

const Rooms = () => {
  return (
    <>
      <Header title="トーク" className="sp" />
      <main className="flex">
        <div>
          <RoomOverview />
        </div>
        <div className="pc">
          <PcNavigation>トークを選択してください</PcNavigation>
        </div>
      </main>
      <div className="sp">
        <BottomNavigation />
      </div>
    </>
  );
};

export default Rooms;
