import Menu, { MenuItem, MenuProps } from '../../molecules/Menu';
import BottomNavigation from '../../organisms/BottomNavigation';
import Header, { ActionItem } from '../../organisms/Header';

const Home = () => {
  return (
    <>
      <Header title="ホーム" isSticky />
      <BottomNavigation />
    </>
  );
};

export default Home;
