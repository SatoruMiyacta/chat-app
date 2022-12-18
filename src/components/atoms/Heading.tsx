import styles from './Heading.module.css';
import { ReactNode, createElement } from 'react';

export interface HeadingProps {
  tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  children: ReactNode;
  size?: 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl';
  align?: 'start' | 'center' | 'end';
  color?: 'black' | 'gray' | 'inherit';
  isBold?: boolean;
}

const Heading = ({
  tag,
  children,
  size = 'm',
  align = 'start',
  color = 'black',
  isBold = false,
}: HeadingProps) => {
  const headingClassList = [styles[size], styles[align], styles[color]];
  if (isBold) headingClassList.push(styles.bold);

  return createElement(
    tag,
    { className: headingClassList.join(' ') },
    children
  );
};

export default Heading;
