import { useState } from 'react';

import styles from './index.module.css';

import {
  faMagnifyingGlass,
  faUser,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Input from '@/components/atoms/Input';
import Tabs, { TabsItem } from '@/components/atoms/Tabs';
import BottomNavigation from '@/components/organisms/BottomNavigation';
import Header from '@/components/organisms/Header';

const Home = () => {
  const [search, setSearch] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const [items, setItems] = useState<TabsItem[]>([
    {
      label: '友達',
      icon: <FontAwesomeIcon icon={faUser} />,
      isDisabled: false,
    },
    {
      label: 'グループ',
      icon: <FontAwesomeIcon icon={faUsers} />,
      isDisabled: false,
    },
  ]);
  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    index: number
  ) => {
    if (items[index] !== items[activeIndex]) setActiveIndex(index);
  };
  return (
    <>
      <Header title="ホーム" />
      <div className={styles.tabs}>
        <Tabs
          color="black"
          items={items}
          activeIndex={activeIndex}
          isBorder
          onClick={(event, index) => handleClick(event, index)}
        />
      </div>
      <div className={styles.searchForm}>
        <Input
          isFullWidth
          type="text"
          color="primary"
          variant="filled"
          id="search"
          placeholder="search"
          value={search}
          // isRounded
          startIcon={<FontAwesomeIcon icon={faMagnifyingGlass} />}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>
      <BottomNavigation />
    </>
  );
};

export default Home;
