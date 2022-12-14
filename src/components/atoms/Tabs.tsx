import styles from './Tabs.module.css';

export interface TabsItem {
  label?: string;
  icon?: React.ReactNode;
  isDisabled?: boolean;
}

export interface TabsProps {
  activeIndex: number;
  items: TabsItem[];
  onClick: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    index: number
  ) => void;
  color?: 'primary' | 'black';
  iconPosition?: 'start' | 'end' | 'top' | 'bottom';
  isBorder?: boolean;
}

const Tabs = ({
  activeIndex,
  items,
  onClick,
  color = 'primary',
  iconPosition = 'start',
  isBorder = false,
}: TabsProps) => {
  const getTabClass = (index: number) => {
    const tabClassNameList = [styles.tab, styles[color]];
    if (iconPosition) tabClassNameList.push(styles[iconPosition]);
    if (isBorder) tabClassNameList.push(styles.border);

    if (index === activeIndex) {
      tabClassNameList.push(styles.active);
    }

    if (items[index].isDisabled) tabClassNameList.push('disabled');

    return tabClassNameList.join(' ');
  };

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    index: number
  ) => {
    onClick(event, index);
  };

  return (
    <div className={styles.tabsContainer}>
      {items.map((item, index) => (
        <button
          key={`tabs-${index}`}
          type="button"
          className={getTabClass(index)}
          disabled={item.isDisabled}
          onClick={(event) => handleClick(event, index)}
        >
          {item.icon && <span className={styles.icon}>{item.icon}</span>}
          {item.label && <span className={styles.label}>{item.label}</span>}
        </button>
      ))}
    </div>
  );
};
export default Tabs;
