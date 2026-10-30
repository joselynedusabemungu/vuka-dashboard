import Image from "next/image";
import Link from "next/link";
import styles from "./landingpage.module.css";

export default function HeroSection() {
  return (
    <section className={styles.heroContainer}>
      <div className={styles.leftColumn}>
        <div className={styles.logoContainer}>
          <Image
            src="/images/vuka_logo1.png"
            alt="Vuka Logo"
            width={130}
            height={45}
            className={styles.logo}
            priority
          />
        </div>

        <div className={styles.details}>
          <h1 className={styles.title}>
            Turn your scroll time into{" "}
            <span className={styles.highlightText}>career pathways</span>
          </h1>

          <p className={styles.description}>
            Discover your strengths, build skills, complete missions and unlock
            opportunities. All in one personalized journey.
          </p>

          <Link href="/signup" passHref>
            <button className={styles.ctaButton}>Create account</button>
          </Link>
        </div>
      </div>

      <div className={styles.rightColumn}>
        <Image
          src="/images/landing.png"
          alt="Illustration of a student walking up a career pathway path"
          fill
          sizes="(max-width: 768px) 100vw, 55vw"
          className={styles.heroImage}
          priority
        />
      </div>
    </section>
  );
}
