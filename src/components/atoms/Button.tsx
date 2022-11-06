import styles from './Button.module.css';

interface ButtonProps {
  color: 'primary' | 'gray' | 'white' | 'danger';
  variant: 'contained' | 'outlined' | 'text';
  children: React.ReactNode;
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  isFullWidth?: boolean;
  isDisabled?: boolean;
}

const Button = ({
  color,
  variant,
  isFullWidth = false,
  isDisabled = false,
  children,
  onClick,
}: ButtonProps) => {
  const classNameList = [styles.button, styles[color], styles[variant]];
  if (isFullWidth) {
    classNameList.push(styles.fullWidth);
  }
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
export default Button;
