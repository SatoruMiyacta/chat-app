import styles from './Modal.module.css';

import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Button from '@/components/atoms/Button';
import type { HeadingProps } from '@/components/atoms/Heading';
import Heading from '@/components/atoms/Heading';

export interface ModalProps {
  children: React.ReactNode;
  onClose: (event: React.MouseEvent<HTMLElement>) => void;
  title?: string;
  titleAlign?: HeadingProps['align'];
  showCloseButton?: boolean;
  isOpen?: boolean;
  isBold?: HeadingProps['isBold'];
  hasInner?: boolean;
}

const Modal = ({
  children,
  onClose,
  title,
  titleAlign = 'start',
  showCloseButton = false,
  isOpen = false,
  isBold,
  hasInner,
}: ModalProps) => {
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
          <Button
            color="inherit"
            variant="text"
            onClick={onClose}
            className={styles.closeButton}
          >
            <FontAwesomeIcon icon={faXmark} size="sm" />
          </Button>
        )}
      </header>
    );
  };

  if (isOpen) {
    return (
      <div className={styles.overlay} onClick={onClose}>
        <div
          className={styles.content}
          onClick={(event) => event.stopPropagation()}
        >
          {createHeader(title, showCloseButton)}
          <div className={childrenClassList.join(' ')}>{children}</div>
        </div>
      </div>
    );
  }
  return null;
};

export default Modal;
