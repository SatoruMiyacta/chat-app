import styles from './Skeleton.module.css';

export interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rounded' | 'rectangular';
  height?: number;
  radius?: number;
  width?: number;
  className?: string;
}

const Skeleton = ({
  variant = 'text',
  height,
  radius,
  width,
  className,
}: SkeletonProps) => {
  const classNameList = [styles.skeleton, styles[variant], className];

  return (
    <span
      style={{
        height: `${height}px`,
        borderRadius: `${radius}px`,
        width: `${width}px`,
      }}
      className={classNameList.join(' ')}
    ></span>
  );
};
export default Skeleton;
