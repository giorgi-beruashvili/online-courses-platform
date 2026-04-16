import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";

import { ROUTES } from "../../constants/routes";
import { useAuth } from "../../../app/providers/auth-provider";
import { useModal } from "../../../app/providers/modal-provider";
import logoIcon from "../../../assets/logo-icon.svg";
import facebookIcon from "../../../assets/Facebook.svg";
import twitterIcon from "../../../assets/Twitter.svg";
import instagramIcon from "../../../assets/Instagram.svg";
import linkedinIcon from "../../../assets/LinkedIn.svg";
import youtubeIcon from "../../../assets/YouTube.svg";
import styles from "./footer.module.css";

export function Footer() {
  const { isAuthenticated } = useAuth();
  const { openLogin, openProfile, openEnrolledSidebar } = useModal();

  function handleEnrolledCoursesClick() {
    if (isAuthenticated) {
      openEnrolledSidebar();
      return;
    }

    openLogin();
  }

  function handleProfileClick() {
    if (isAuthenticated) {
      openProfile();
      return;
    }

    openLogin();
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.brandColumn}>
            <div className={styles.brandRow}>
              <span className={styles.logoBadge}>
                <img
                  src={logoIcon}
                  alt="Bootcamp"
                  className={styles.logoIcon}
                />
              </span>

              <span className={styles.brandName}>Bootcamp</span>
            </div>

            <p className={styles.brandText}>
              Your learning journey starts here!
              <br />
              Browse courses to get started.
            </p>

            <div className={styles.socials}>
              <a href="#" className={styles.socialLink} aria-label="Facebook">
                <img src={facebookIcon} alt="" className={styles.socialIcon} />
              </a>

              <a href="#" className={styles.socialLink} aria-label="Twitter">
                <img src={twitterIcon} alt="" className={styles.socialIcon} />
              </a>

              <a href="#" className={styles.socialLink} aria-label="Instagram">
                <img src={instagramIcon} alt="" className={styles.socialIcon} />
              </a>

              <a href="#" className={styles.socialLink} aria-label="LinkedIn">
                <img src={linkedinIcon} alt="" className={styles.socialIcon} />
              </a>

              <a href="#" className={styles.socialLink} aria-label="YouTube">
                <img src={youtubeIcon} alt="" className={styles.socialIcon} />
              </a>
            </div>
          </div>

          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Explore</h3>

            <button
              type="button"
              className={styles.footerAction}
              onClick={handleEnrolledCoursesClick}
            >
              Enrolled Courses
            </button>

            <Link to={ROUTES.COURSES} className={styles.footerLink}>
              Browse Courses
            </Link>
          </div>

          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Account</h3>

            <button
              type="button"
              className={styles.footerAction}
              onClick={handleProfileClick}
            >
              My Profile
            </button>
          </div>

          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Contact</h3>

            <div className={styles.contactItem}>
              <Mail size={16} strokeWidth={1.8} />
              <span>contact@company.com</span>
            </div>

            <div className={styles.contactItem}>
              <Phone size={16} strokeWidth={1.8} />
              <span>(+995) 555 111 222</span>
            </div>

            <div className={styles.contactItem}>
              <MapPin size={16} strokeWidth={1.8} />
              <span>Aghmashenebeli St.115</span>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            Copyright © 2026 Redberry International
          </p>

          <div className={styles.legal}>
            <span>All Rights Reserved</span>
            <span className={styles.separator}>|</span>
            <a href="#" className={styles.legalLink}>
              Terms and Conditions
            </a>
            <span className={styles.separator}>|</span>
            <a href="#" className={styles.legalLink}>
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
