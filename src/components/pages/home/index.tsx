import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { faBan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { MenuItem } from '@/components/molecules/Menu';
import BottomNavigation from '@/components/organisms/BottomNavigation';
import Header from '@/components/organisms/Header';
import HomeOverview from '@/components/organisms/HomeOverview';
import PcNavigation from '@/components/organisms/PcNavigation';

const Home = () => {
  const navigate = useNavigate();

  const [blockMenuItems] = useState<MenuItem[]>([
    {
      label: (
        <>
          <FontAwesomeIcon
            icon={faBan}
            style={{ marginRight: '8px', opacity: 0.5 }}
          />
          ブロック
        </>
      ),
      onClick: () => navigate('/block'),
    },
  ]);

  return (
    <>
      <Header title="ホーム" className="sp" menu={blockMenuItems} />
      <main>
        <div className="sp">
          <HomeOverview />
        </div>
        <div className="pc">
          <PcNavigation>
            ユーザーもしくはグループを選択してください
          </PcNavigation>
        </div>
      </main>
      <div className="sp">
        <BottomNavigation />
      </div>
    </>
  );
};

export default Home;
