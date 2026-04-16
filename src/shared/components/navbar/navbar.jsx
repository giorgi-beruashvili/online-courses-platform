import { NavLink } from "react-router-dom";
import clsx from "clsx";
import { BookOpen, Sparkles, UserRound } from "lucide-react";

import { ROUTES } from "../../constants/routes";
import { useAuth } from "../../../app/providers/auth-provider";
import { useModal } from "../../../app/providers/modal-provider";
import logoIcon from "../../../assets/logo-icon.svg";
import styles from "./navbar.module.css";

export function Navbar() {
  const { isAuthenticated, isProfileComplete } = useAuth();
  const { openLogin, openRegister, openProfile, openEnrolledSidebar } =
    useModal();

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <NavLink
          to={ROUTES.HOME}
          className={styles.logo}
          aria-label="Go to home page"
        >
          <img src={logoIcon} alt="RedClass" className={styles.logoIcon} />
        </NavLink>

        <nav className={styles.nav}>
          <NavLink
            to={ROUTES.COURSES}
            className={({ isActive }) =>
              clsx(styles.navLink, isActive && styles.navLinkActive)
            }
          >
            <Sparkles size={18} strokeWidth={1.8} />
            <span>Browse Courses</span>
          </NavLink>

          {isAuthenticated ? (
            <button
              type="button"
              className={clsx(styles.navLink, styles.navButton)}
              onClick={openEnrolledSidebar}
            >
              <BookOpen size={18} strokeWidth={1.8} />
              <span>Enrolled Courses</span>
            </button>
          ) : null}
        </nav>

        <div className={styles.actions}>
          {!isAuthenticated ? (
            <>
              <button
                type="button"
                className={clsx(
                  "button button-secondary",
                  styles.authButton,
                  styles.loginButton,
                )}
                onClick={openLogin}
              >
                Log In
              </button>

              <button
                type="button"
                className={clsx(
                  "button button-primary",
                  styles.authButton,
                  styles.signupButton,
                )}
                onClick={openRegister}
              >
                Sign Up
              </button>
            </>
          ) : (
            <button
              type="button"
              className={styles.profileIconButton}
              onClick={openProfile}
              aria-label="Open profile"
              title={isProfileComplete ? "Open profile" : "Complete profile"}
            >
              <UserRound size={24} strokeWidth={1.9} />
              <span
                className={clsx(
                  styles.profileDot,
                  isProfileComplete
                    ? styles.profileDotComplete
                    : styles.profileDotIncomplete,
                )}
              />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
