import styles from './Modal.module.css';
import Heading, { HeadingProps } from '../atoms/Heading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

export interface ModalProps {
  children: React.ReactNode;
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
  title?: string;
  titleAlign?: HeadingProps['align'];
  showCloseButton?: boolean;
  isOpen?: boolean;
  isBold?: HeadingProps['isBold'];
  hasInner?: boolean;
}

const Modal = ({
  children,
  onClick,
  title,
  titleAlign = 'start',
  showCloseButton = false,
  isOpen = false,
  isBold,
  hasInner,
}: ModalProps) => {
  const onClose = (event: React.MouseEvent<HTMLElement>) => {
    onClick(event);
  };

  const childrenClassList = [];
  if (hasInner) childrenClassList.push(styles.inner);

  const createHeader = (title?: string, showCloseButton?: boolean) => {
    if (!title && !showCloseButton) return;

    return (
      <header className={styles.contentHeader}>
        {title && (
          <Heading tag="h1" size="xxl" isBold={isBold} align={titleAlign}>
            {title}
          </Heading>
        )}
        {showCloseButton && (
          <button className={styles.closeButton} onClick={onClose}>
            <FontAwesomeIcon icon={faXmark} size="sm" />
          </button>
        )}
      </header>
    );
  };

  if (isOpen) {
    return (
      <>
        <div className={styles.overlay} onClick={onClose}>
          <div
            className={styles.content}
            onClick={(event) => event.stopPropagation()}
          >
            {createHeader(title, showCloseButton)}
            <div className={childrenClassList.join(' ')}>{children}</div>
          </div>
        </div>
      </>
    );
  }
  return null;
};

export default Modal;
