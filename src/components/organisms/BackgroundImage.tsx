import React, { useRef } from 'react';

import Button from '../atoms/Button';

import styles from './BackgroundImage.module.css';

import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export interface BackgroundImageProps {
  iconUrl: string;
  onChange?: (event: React.FocusEvent<HTMLInputElement, Element>) => void;
  hasCameraIcon?: boolean;
  hasBackgroundImage?: boolean;
  iconPosition?: 'center' | 'under' | 'left' | 'right';
  isUploadButton?: boolean;
  uploadIconButtonSize?: 'small' | 'medium' | 'large';
  className?: string;
}

const BackgroundImage = ({
  iconUrl,
  onChange,
  hasCameraIcon = false,
  iconPosition = 'center',
  hasBackgroundImage = false,
  isUploadButton = false,
  uploadIconButtonSize = 'medium',
  className,
}: BackgroundImageProps) => {
  const inputFileRef = useRef<HTMLInputElement>(null);

  const uploadWrapperClassList = [
    styles.uploadWrapper,
    styles[iconPosition],
    className,
  ];

  const uploadIconButtonClassList = [
    styles.uploadIconButton,
    styles[uploadIconButtonSize],
  ];

  const showBackgroundImage = () => {
    if (!hasBackgroundImage) return {};
    if (hasBackgroundImage) {
      return { backgroundImage: `url(${iconUrl})` };
    }
  };

  return (
    <>
      <div
        className={`${uploadWrapperClassList.join(' ')} `}
        style={showBackgroundImage()}
      >
        <button
          id="imageUpload"
          className={`${uploadIconButtonClassList.join(' ')}`}
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
        {isUploadButton && (
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
        )}
      </div>

      {/*      
      <div className={`${styles.uploadWrapper} pc`}>
        <button
          id="imageUpload"
          className={`${uploadIconButtonClassList.join(' ')}`}
          onClick={() => inputFileRef.current?.click()}
        >
          <img src={iconUrl} />
        </button>
        <input
          id="imageUpload"
          ref={inputFileRef}
          type="file"
          className={styles.uploadInput}
          accept=".png, .jpeg, .jpg"
          onChange={onChange}
        />
      </div>
      {isUploadButton && (
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
            accept=".png, .jpeg, .jpg"
            onChange={onChange}
          />
        </div>
      )} */}
    </>
  );
};
export default BackgroundImage;
