import { NavLink } from "react-router-dom";
import clsx from "clsx";

import { ROUTES } from "../../constants/routes";
import { useAuth } from "../../../app/providers/auth-provider";
import { useModal } from "../../../app/providers/modal-provider";
import styles from "./navbar.module.css";

function getInitials(user) {
  if (user?.fullName) {
    return user.fullName
      .split(" ")
      .slice(0, 2)
      .map((item) => item[0])
      .join("")
      .toUpperCase();
  }

  if (user?.email) {
    return user.email[0].toUpperCase();
  }

  return "U";
}

export function Navbar() {
  const { isAuthenticated, user, isProfileComplete } = useAuth();
  const { openLogin, openRegister, openProfile, openEnrolledSidebar } =
    useModal();

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

        <div className={styles.actions}>
          {!isAuthenticated ? (
            <>
              <button
                type="button"
                className="button button-secondary"
                onClick={openLogin}
              >
                Log In
              </button>

              <button
                type="button"
                className="button button-primary"
                onClick={openRegister}
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="button button-secondary"
                onClick={openEnrolledSidebar}
              >
                Enrolled Courses
              </button>

              <button
                type="button"
                className={styles.profileButton}
                onClick={openProfile}
                aria-label="Open profile"
                title="Open profile"
              >
                <span className={styles.profileInitial}>
                  {getInitials(user)}
                </span>

                <span className={styles.profileMeta}>
                  <span className={styles.profileName}>
                    {user?.fullName || user?.email || "User"}
                  </span>
                  <span
                    className={clsx(
                      styles.profileStatus,
                      isProfileComplete ? styles.complete : styles.incomplete,
                    )}
                  >
                    {isProfileComplete
                      ? "Profile Complete"
                      : "Profile Incomplete"}
                  </span>
                </span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
