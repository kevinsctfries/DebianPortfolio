import styles from "./about.module.scss";

export default function About() {
  return (
    <div className={styles.about}>
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <h1 className={styles.name}>Kevin</h1>
          <p className={styles.tagline}>Full-Stack Developer</p>
        </div>
      </div>

      <div className={styles.content}>
        <section className={styles.section}>
          <h2>About</h2>
          <p>Hi, my name is Kevin. I am a self taught full-stack developer!</p>
        </section>

        <section className={styles.section}>
          <h2>Skills</h2>
          <p>TypeScript/JavaScript, React, Next.js, Angular</p>
        </section>

        <section className={styles.section}>
          <h2>Contact</h2>
          <p>
            Email:
            <a href="mailto:kevinsctfries@gmail.com">kevinsctfries@gmail.com</a>
            <br />
            GitHub:
            <a href="https://github.com/kevinsctfries">
              github.com/kevinsctfries
            </a>
            <br />
            Website: <a href="https://kevinsctfries.com">kevinsctfries.com</a>
          </p>
        </section>

        <section className={styles.section}>
          <h2>Credits</h2>
          <p>Built with Next.js | TypeScript | react-rnd</p>
        </section>
      </div>
    </div>
  );
}
