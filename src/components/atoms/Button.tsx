import styles from './Button.module.css';

export interface ButtonProps {
  color: 'primary' | 'inherit' | 'white' | 'danger';
  variant: 'contained' | 'outlined' | 'text';
  children: React.ReactNode;
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  isFullWidth?: boolean;
  isDisabled?: boolean;
  isRounded?: boolean;
}

const Button = ({
  color,
  variant,
  isFullWidth = false,
  isDisabled = false,
  isRounded = true,
  size = 'medium',
  children,
  className,
  onClick,
}: ButtonProps) => {
  const classNameList = [
    styles.button,
    styles[color],
    styles[variant],
    styles[size],
    className,
  ];
  if (isFullWidth) {
    classNameList.push(styles.fullWidth);
  }
  if (isDisabled) {
    classNameList.push('disabled');
  }

  if (isRounded) {
    classNameList.push(styles.isRounded);
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
