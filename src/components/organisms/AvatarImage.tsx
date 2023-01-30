import React, { useRef } from 'react';

import Button from '../atoms/Button';

import styles from './AvatarImage.module.css';

import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export interface AvatarImageProps {
  iconUrl: string;
  onChange?: (event: React.FocusEvent<HTMLInputElement, Element>) => void;
  hasCameraIcon?: boolean;
  isUploadButton?: boolean;
  isNotUpload?: boolean;
  uploadIconSize?: 'small' | 'medium' | 'large';
  className?: string;
}

const AvatarImage = ({
  iconUrl,
  onChange,
  hasCameraIcon = false,
  isUploadButton = false,
  isNotUpload = false,
  uploadIconSize = 'medium',
  className,
}: AvatarImageProps) => {
  const inputFileRef = useRef<HTMLInputElement>(null);

  const showUploadButton = () => {
    if (!isUploadButton) return;

    return (
      <div className={styles.uploadButton}>
        <Button
          color="primary"
          variant="outlined"
          onClick={() => inputFileRef.current?.click()}
          size="small"
        >
          画像選択
        </Button>
        <input
          id="imageUpload"
          ref={inputFileRef}
          type="file"
          className={styles.uploadInput}
          accept=".png, .jpeg, .jpg, .gif"
          onChange={onChange}
        />
      </div>
    );
  };

  const uploadIconClassList = [
    styles.uploadIcon,
    styles[uploadIconSize],
    className,
  ];

  return (
    <>
      {isNotUpload && (
        <div className={`${uploadIconClassList.join(' ')}`}>
          <img src={iconUrl} />
          {hasCameraIcon && (
            <FontAwesomeIcon
              icon={faCamera}
              color="#333"
              size="sm"
              className={styles.cameraIcon}
            />
          )}
        </div>
      )}
      {!isNotUpload && (
        <div>
          <button
            id="imageUpload"
            className={`${uploadIconClassList.join(' ')}`}
            onClick={() => inputFileRef.current?.click()}
          >
            <img src={iconUrl} />
            {hasCameraIcon && (
              <FontAwesomeIcon
                icon={faCamera}
                color="#333"
                size="sm"
                className={styles.cameraIcon}
              />
            )}
          </button>
          <input
            id="imageUpload"
            ref={inputFileRef}
            type="file"
            className={styles.uploadInput}
            accept=".png, .jpeg, .jpg, .gif"
            onChange={onChange}
          />
        </div>
      )}
      {showUploadButton()}
    </>
  );
};
export default AvatarImage;
