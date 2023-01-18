import {
  faCircleUser,
  faComment,
  faHouse,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useLocation } from 'react-router-dom';
import styles from './SideMenu.module.css';

const SideMenu = () => {
  const location = useLocation();

  const getActiveClass = (path: string) => {
    const result = path.slice(1);
    if (location.pathname.indexOf(result) > 0) {
      return styles.active;
    } else if (location.pathname === path) {
      return styles.active;
    }
  };
  return (
    <div className={`${styles.sideMenu}`}>
      <ul className={styles.navigationItems}>
        <li>
          <Link className={getActiveClass('/')} to={'/'}>
            <FontAwesomeIcon
              icon={faHouse}
              style={{ marginRight: '8px', marginLeft: '16px' }}
              size={'xl'}
            />
            ホーム
          </Link>
        </li>
        <li>
          <Link className={getActiveClass('/rooms')} to={'/rooms'}>
            <FontAwesomeIcon
              icon={faComment}
              style={{ marginRight: '8px', marginLeft: '16px' }}
              size={'xl'}
            />
            トーク
          </Link>
        </li>
        <li>
          <Link className={getActiveClass('/group')} to={'/group'}>
            <FontAwesomeIcon
              icon={faPlus}
              style={{ marginRight: '8px', marginLeft: '16px' }}
              size={'xl'}
            />
            グループ作成
          </Link>
        </li>
        <li>
          <Link className={getActiveClass('/profile')} to={'/profile'}>
            <FontAwesomeIcon
              icon={faCircleUser}
              style={{ marginRight: '8px', marginLeft: '16px' }}
              size={'xl'}
            />
            プロフィール
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default SideMenu;
