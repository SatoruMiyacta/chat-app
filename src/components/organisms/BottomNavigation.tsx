import { useLocation, Link } from 'react-router-dom';

import styles from './BottomNavigation.module.css';

import {
  faHouse,
  faCircleUser,
  faComment,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const BottomNavigation = () => {
  const location = useLocation();

  const getActiveClass = (path: string) => {
    if (location.pathname === path) return styles.active;
  };

  return (
    <nav className={styles.bottomNavigation}>
      <ul className={styles.navigationItems}>
        <li>
          <Link className={getActiveClass('/')} to={'/'}>
            <FontAwesomeIcon
              icon={faHouse}
              style={{ marginBottom: '4px' }}
              size={'xl'}
            />
            ホーム
          </Link>
        </li>
        <li>
          <Link className={getActiveClass('/rooms')} to={'/rooms'}>
            <FontAwesomeIcon
              icon={faComment}
              style={{ marginBottom: '4px' }}
              size={'xl'}
            />
            トーク
          </Link>
        </li>
        <li>
          <Link className={getActiveClass('/profile')} to={'/profile'}>
            <FontAwesomeIcon
              icon={faCircleUser}
              style={{ marginBottom: '4px' }}
              size={'xl'}
            />
            プロフィール
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default BottomNavigation;
