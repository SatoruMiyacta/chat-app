import AvatarImage, { AvatarImageProps } from './AvatarImage';
import styles from './ProfileImage.module.css';

export interface ProfileImageProps {
  imageUrl: string;
  avatarIconPosition?: 'center' | 'under' | 'left' | 'right';
  onChange?: AvatarImageProps['onChange'];
  hasCameraIcon?: AvatarImageProps['hasCameraIcon'];
  isUploadButton?: AvatarImageProps['isUploadButton'];
  isNotUpload?: AvatarImageProps['isNotUpload'];
  uploadIconSize?: AvatarImageProps['uploadIconSize'];
  className?: string;
}

const ProfileImage = ({
  imageUrl,
  avatarIconPosition = 'center',
  onChange,
  hasCameraIcon = false,
  isUploadButton = false,
  isNotUpload = false,
  uploadIconSize = 'medium',
  className,
}: ProfileImageProps) => {
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
      <AvatarImage
        iconUrl={imageUrl}
        onChange={onChange}
        hasCameraIcon={hasCameraIcon}
        isUploadButton={isUploadButton}
        isNotUpload={isNotUpload}
        uploadIconSize={uploadIconSize}
      />
    </div>
  );
};
export default ProfileImage;
