import styles from './FloatingActionButton.module.css';

interface FabProps {
  color: 'primary' | 'gray' | 'white' | 'danger';
  variant: 'circular' | 'extended';
  children: React.ReactNode;
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  size?: 'small' | 'medium' | 'large';
  isDisabled?: boolean;
}

const Fab = ({
  color,
  variant,
  children,
  onClick,
  size = 'medium',
  isDisabled = false,
}: FabProps) => {
  const classNameList = [
    styles.button,
    styles[color],
    styles[variant],
    styles[size],
  ];

  if (isDisabled) {
    classNameList.push(styles.disabled);
  }

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (isDisabled) {
      return;
    }
    onClick(event);
  };

  return (
    <button
      type="button"
      className={classNameList.join(' ')}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};
export default Fab;
