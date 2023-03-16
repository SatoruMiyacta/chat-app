import Avatar, { AvatarProps } from './Avatar';
import styles from './AvatarBackgroundImage.module.css';

export interface AvatarBackgroundImageProps {
  imageUrl: string;
  avatarIconPosition?: 'center' | 'under' | 'left' | 'right';
  onChange?: AvatarProps['onChange'];
  hasCameraIcon?: AvatarProps['hasCameraIcon'];
  isNotUpload?: AvatarProps['isNotUpload'];
  uploadIconSize?: AvatarProps['uploadIconSize'];
  className?: string;
}

const AvatarBackgroundImage = ({
  imageUrl,
  avatarIconPosition = 'center',
  onChange,
  hasCameraIcon = false,
  isNotUpload = false,
  uploadIconSize = 'm',
  className,
}: AvatarBackgroundImageProps) => {
  const backgroundImageClassList = [
    styles.backgroundImage,
    styles[avatarIconPosition],
    className,
  ];

  return (
    <div
      className={`${backgroundImageClassList.join(' ')} `}
      style={{ backgroundImage: `url(${imageUrl})` }}
    >
      <Avatar
        iconUrl={imageUrl}
        onChange={onChange}
        hasCameraIcon={hasCameraIcon}
        isNotUpload={isNotUpload}
        uploadIconSize={uploadIconSize}
      />
    </div>
  );
};
export default AvatarBackgroundImage;
