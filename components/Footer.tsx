import styles from './Footer.module.css';

export const Footer = () => {
  return (
    <>
      <footer className={styles.footer}>
        Made with{' '}
        <img src="/netliheart.svg" alt="Netlify Logo" className={styles.logo} />
        for you
      </footer>
    </>
  );
};
