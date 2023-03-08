import styles from './PcNavigation.module.css';

export interface PcNavigationProps {
  children: React.ReactNode;
}

const PcNavigation = ({ children }: PcNavigationProps) => {
  return <div className={`${styles.navigation} inner`}>{children}</div>;
};

export default PcNavigation;
