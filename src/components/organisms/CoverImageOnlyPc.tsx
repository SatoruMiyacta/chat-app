import styles from './CoverImageOnlyPc.module.css';
const CoverImageOnlyPc = () => {
  return (
    <div className={`${styles.img} pc`}>
      <img src="/images/chat.svg" alt="カバー画像" />
    </div>
  );
};

export default CoverImageOnlyPc;
