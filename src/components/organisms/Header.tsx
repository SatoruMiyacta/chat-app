import { useNavigate } from 'react-router-dom';

import Menu, { MenuProps } from '../molecules/Menu';

import styles from './Header.module.css';

import {
  faEllipsisVertical,
  faChevronLeft,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Heading';

export interface ActionItem {
  item: React.ReactNode;
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export interface HeaderProps {
  title: string;
  className?: string;
  showBackButton?: boolean;
  actionItems?: ActionItem[];
  menu?: MenuProps['items'];
}

const Header = ({
  title,
  className,
  actionItems,
  showBackButton = false,
  menu,
}: HeaderProps) => {
  const navigate = useNavigate();

  const createActionItems = () => {
    if (!actionItems) return;

    return (
      <ul className={styles.actionItems}>
        {actionItems.map((actionItem, index) => (
          <li key={`header-${index}`}>
            <Button
              color="white"
              variant="text"
              onClick={(event) => {
                actionItem.onClick(event);
              }}
            >
              {actionItem.item}
            </Button>
          </li>
        ))}
      </ul>
    );
  };

  const headerStyle = { paddingLeft: '16px', paddingRight: '16px' };
  if (showBackButton) headerStyle.paddingLeft = '8px';
  if (menu?.length !== 0 || actionItems?.length !== 0) {
    headerStyle.paddingRight = '8px';
  }
  const headerClassList = [styles.header, className];

  return (
    <header className={headerClassList.join(' ')} style={headerStyle}>
      {showBackButton && (
        <Button
          className={styles.backButton}
          color="white"
          variant="text"
          onClick={() => navigate(-1)}
        >
          {<FontAwesomeIcon icon={faChevronLeft} />}
        </Button>
      )}
      <Heading
        tag="h1"
        color="inherit"
        size="l"
        align="start"
        className={styles.title}
      >
        {title}
      </Heading>
      <div className={styles.actionArea}>
        {createActionItems()}
        {menu && (
          <Menu
            items={menu}
            buttonChildren={<FontAwesomeIcon icon={faEllipsisVertical} />}
            buttonColor="white"
          />
        )}
      </div>
    </header>
  );
};

export default Header;
