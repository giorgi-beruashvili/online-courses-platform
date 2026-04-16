import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ROUTES } from "../../constants/routes";
import styles from "./hero-slider.module.css";

export default function HeroSlider() {
  return (
    <section className={styles.hero} aria-label="Featured courses banner">
      <div className={styles.content}>
        <h2 className={styles.title}>Start learning something new today</h2>

        <p className={styles.description}>
          Explore a wide range of expert-led courses in design, development,
          business, and more. Find the skills you need to grow your career and
          learn at your own pace.
        </p>

        <Link to={ROUTES.courses || "/courses"} className={styles.ctaButton}>
          Browse Courses
        </Link>
      </div>

      <div className={styles.dots} aria-hidden="true">
        <span className={`${styles.dot} ${styles.dotActive}`} />
        <span className={styles.dot} />
        <span className={styles.dot} />
      </div>

      <div className={styles.controls} aria-hidden="true">
        <button
          type="button"
          className={styles.arrowButton}
          disabled
          tabIndex={-1}
        >
          <ChevronLeft size={22} />
        </button>

        <button
          type="button"
          className={styles.arrowButton}
          disabled
          tabIndex={-1}
        >
          <ChevronRight size={22} />
        </button>
      </div>
    </section>
  );
}
