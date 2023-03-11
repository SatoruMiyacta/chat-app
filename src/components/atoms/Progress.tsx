import styles from './Progress.module.css';

export interface SkeletonProps {
  color?: 'primary' | 'inherit';
  size?: number;
  thickness?: number;
  className?: string;
}

const Progress = ({
  color = 'inherit',
  size = 40,
  thickness = 3.6,
  className,
}: SkeletonProps) => {
  const classNameList = [styles.progress, styles[color], className];

  return (
    <span
      style={{
        height: `${size}px`,
        width: `${size}px`,
        borderRadius: `${size}px`,
        borderWidth: `${thickness}px`,
      }}
      className={classNameList.join(' ')}
    ></span>
  );
};
export default Progress;
