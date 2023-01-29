import React, { useRef } from 'react';

import Button from '../atoms/Button';

import styles from './IconImage.module.css';

import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export interface IconImageProps {
  iconUrl: string;
  onChange?: (event: React.FocusEvent<HTMLInputElement, Element>) => void;
  hasCameraIcon?: boolean;
  isUploadButton?: boolean;
  isNotUpload?: boolean;
  uploadIconSize?: 'small' | 'medium' | 'large';
  className?: string;
}

const IconImage = ({
  iconUrl,
  onChange,
  hasCameraIcon = false,
  isUploadButton = false,
  isNotUpload = false,
  uploadIconSize = 'medium',
  className,
}: IconImageProps) => {
  const inputFileRef = useRef<HTMLInputElement>(null);

  const uploadIconClassList = [
    styles.uploadIcon,
    styles[uploadIconSize],
    className,
  ];

  const showUploadButton = () => {
    if (isUploadButton) {
      return (
        <div className="pc">
          <Button
            color="primary"
            variant="outlined"
            onClick={() => inputFileRef.current?.click()}
            className={styles.uploadButton}
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
    }
  };

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
        <>
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
        </>
      )}
      {showUploadButton()}
    </>
  );
};
export default IconImage;
