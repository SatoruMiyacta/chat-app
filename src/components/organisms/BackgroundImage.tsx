import { useRef } from 'react';

import styles from './BackgroundImage.module.css';

import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export interface BackgroundImageProps {
  iconUrl: string;
  onChange?: (event: React.FocusEvent<HTMLInputElement, Element>) => void;
  hasCameraIcon?: boolean;
  iconPosition?: 'center' | 'under' | 'left' | 'right';
  className?: string;
}

const BackgroundImage = ({
  iconUrl,
  onChange,
  hasCameraIcon = false,
  iconPosition = 'center',
  className,
}: BackgroundImageProps) => {
  const inputFileRef = useRef<HTMLInputElement>(null);

  const uploadWrapperClassList = [
    styles.uploadWrapper,
    styles[iconPosition],
    className,
  ];

  return (
    <>
      {/* 画面サイズが1024px以下のとき、背景を表示させる。 */}
      <div
        className={`${uploadWrapperClassList.join(' ')} sp responsive`}
        style={{ backgroundImage: `url(${iconUrl})` }}
      >
        <button
          id="imageUpload"
          className={styles.uploadIconButton}
          onClick={() => inputFileRef.current?.click()}
        >
          <img src={iconUrl} alt="icon" />
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
          accept=".png, .jpeg, .jpg"
          onChange={onChange}
        />
      </div>

      {/* 画面サイズが1024px以上のとき、背景を表示させない。 */}
      <div className={`${styles.uploadWrapper} pc responsive`}>
        <button
          id="imageUpload"
          className={styles.uploadIconButton}
          onClick={() => inputFileRef.current?.click()}
        >
          <img src={iconUrl} alt="icon" />
          <FontAwesomeIcon
            icon={faCamera}
            color="#333"
            size="sm"
            className={styles.cameraIcon}
          />
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
    </>
  );
};
export default BackgroundImage;