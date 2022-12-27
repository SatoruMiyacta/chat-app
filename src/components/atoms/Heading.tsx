import type { ReactNode } from 'react';
import { createElement } from 'react';

import styles from './Heading.module.css';

export interface HeadingProps {
  tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  children: ReactNode;
  size?: 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl';
  align?: 'start' | 'center' | 'end';
  color?: 'black' | 'gray' | 'inherit';
  isBold?: boolean;
  className?: string;
}

const Heading = ({
  tag,
  children,
  size = 'm',
  align = 'start',
  color = 'black',
  isBold = false,
  className,
}: HeadingProps) => {
  const headingClassList = [
    styles[size],
    styles[align],
    styles[color],
    className,
  ];
  if (isBold) headingClassList.push(styles.bold);

  return createElement(
    tag,
    { className: headingClassList.join(' ') },
    children
  );
};

export default Heading;
