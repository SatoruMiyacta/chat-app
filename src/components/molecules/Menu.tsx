import { useEffect, useRef, useState } from 'react';

import styles from './Menu.module.css';

import type { ButtonProps } from '@/components/atoms/Button';
import Button from '@/components/atoms/Button';

export interface MenuItem {
  label: React.ReactNode;
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export interface MenuProps {
  items: MenuItem[];
  buttonChildren: React.ReactNode;
  buttonColor?: ButtonProps['color'];
}

const Menu = ({
  items,
  buttonChildren,
  buttonColor = 'inherit',
}: MenuProps) => {
  const [open, setOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState('lowerLeft');
  const menuRef = useRef<HTMLUListElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  const getMenuPosition = () => {
    const menuCoordinate = menuRef.current?.getBoundingClientRect();
    const buttonCoordinate = buttonRef.current?.getBoundingClientRect();

    if (!menuCoordinate) return;
    if (!buttonCoordinate) return;

    const menuHeight = menuCoordinate.height;
    const menuWidth = menuCoordinate.width;
    const buttonLeft = buttonCoordinate.x;
    const buttonTop = buttonCoordinate.y;
    const buttonBottom = window.innerHeight - buttonCoordinate.bottom;
    const buttonRight = window.innerWidth - buttonCoordinate.right;

    if (buttonLeft > menuWidth) {
      if (buttonBottom > menuHeight) {
        return 'lowerLeft';
      } else if (buttonTop > menuHeight) {
        return 'upperLeft';
      }
    } else if (buttonRight > menuWidth) {
      if (buttonBottom > menuHeight) {
        return 'lowerRight';
      } else if (buttonTop > menuHeight) {
        return 'upperRight';
      }
    }
  };

  useEffect(() => {
    const _menuPosition = getMenuPosition();

    if (!_menuPosition) return;

    setMenuPosition(_menuPosition);
  }, [open]);

  const menuItemsClassList = [styles.menu, styles[menuPosition]];

  const createMenu = (open: boolean) => {
    if (!open) return;
    return (
      <>
        <ul className={menuItemsClassList.join(' ')} ref={menuRef}>
          {items.map((item, index) => (
            <li key={`menu-${index}`}>
              <button
                type="button"
                className={styles.label}
                onClick={(event) => {
                  setOpen(false);
                  item.onClick(event);
                }}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
        <div className={styles.overlay} onClick={() => setOpen(false)}></div>
      </>
    );
  };

  return (
    <div className={styles.menuContainer}>
      <div ref={buttonRef}>
        <Button
          color={buttonColor}
          variant="text"
          onClick={() => setOpen(true)}
        >
          {buttonChildren}
        </Button>
      </div>
      {createMenu(open)}
    </div>
  );
};

export default Menu;
