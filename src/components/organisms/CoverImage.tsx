import styles from './coverImage.module.css';
const CoverImage = () => {
  return (
    <>
      <img
        className={`${styles.img} pc responsive`}
        src="/public/images/login.svg"
        alt="images"
      />
    </>
  );
};

export default CoverImage;
