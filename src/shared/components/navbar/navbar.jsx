import { NavLink } from "react-router-dom";
import clsx from "clsx";

import { ROUTES } from "../../constants/routes";
import styles from "./navbar.module.css";

export function Navbar() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <NavLink to={ROUTES.HOME} className={styles.logo}>
          RedClass
        </NavLink>

        <nav className={styles.nav}>
          <NavLink
            to={ROUTES.COURSES}
            className={({ isActive }) =>
              clsx(styles.navLink, isActive && styles.navLinkActive)
            }
          >
            Browse Courses
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
