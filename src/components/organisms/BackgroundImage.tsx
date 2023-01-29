import React from 'react';

import styles from './BackgroundImage.module.css';

export interface BackgroundImageProps {
  imageUrl: string;
  childrenPosition?: 'center' | 'under' | 'left' | 'right';
  children?: React.ReactNode;
  className?: string;
}

const BackgroundImage = ({
  imageUrl,
  childrenPosition = 'center',
  className,
  children,
}: BackgroundImageProps) => {
  const backgroundImageClassList = [
    styles.backgroundImage,
    styles[childrenPosition],
    className,
  ];

  return (
    <div
      className={`${backgroundImageClassList.join(' ')} `}
      style={{ backgroundImage: `url(${imageUrl})` }}
    >
      <div>{children}</div>
    </div>
  );
};
export default BackgroundImage;
