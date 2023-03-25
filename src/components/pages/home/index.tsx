import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { faBan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { MenuItem } from '@/components/molecules/Menu';
import BottomNavigation from '@/components/organisms/BottomNavigation';
import EditGroupOverview from '@/components/organisms/EditGroupOverview';
import GroupOverview from '@/components/organisms/GroupOverview';
import Header from '@/components/organisms/Header';
import HomeOverview from '@/components/organisms/HomeOverview';
import PcNavigation from '@/components/organisms/PcNavigation';
import UsersOverview from '@/components/organisms/UserOverview';

const Home = () => {
  const [searchPatams] = useSearchParams();
  const navigate = useNavigate();

  const userPathId = searchPatams.get('userId');
  const groupPathId = searchPatams.get('groupId');
  const groupEditPathId = searchPatams.get('groupEditId');

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
          {!userPathId && !groupPathId && !groupEditPathId && (
            <PcNavigation>
              ユーザーもしくはグループを選択してください
            </PcNavigation>
          )}
          {userPathId && <UsersOverview userId={userPathId} />}
          {groupPathId && <GroupOverview groupId={groupPathId} />}
          {groupEditPathId && <EditGroupOverview groupId={groupEditPathId} />}
        </div>
      </main>
      <div className="sp">
        <BottomNavigation />
      </div>
    </>
  );
};

export default Home;
