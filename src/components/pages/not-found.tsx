import { useNavigate } from 'react-router-dom';

import styles from './not-found.module.css';

import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Heading';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <section className={styles.container}>
      <Heading
        tag="h1"
        size="xxl"
        align="center"
        isBold
        className={styles.notFound}
      >
        404
        <span>Not Found</span>
      </Heading>
      <p className={styles.sentence}>
        <FontAwesomeIcon
          icon={faTriangleExclamation}
          color="#ff971d"
          size="xl"
        />
        <span>このページは存在しません。</span>
      </p>
      <Button
        className={styles.button}
        color="primary"
        variant="outlined"
        onClick={() => navigate('/')}
      >
        ホームに戻る
      </Button>
    </section>
  );
};

export default NotFound;
