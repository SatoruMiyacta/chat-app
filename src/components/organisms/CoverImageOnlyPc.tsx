import styles from './CoverImageOnlyPc.module.css';
const CoverImageOnlyPc = () => {
  return (
    <div className={`${styles.img} pc`}>
      <img src="/public/images/chat.svg" />
    </div>
  );
};

export default CoverImageOnlyPc;
