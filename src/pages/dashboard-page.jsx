import { Link } from "react-router-dom";
import { Lock } from "lucide-react";

import { ROUTES } from "../shared/constants/routes";
import { useAuth } from "../app/providers/auth-provider";
import { useModal } from "../app/providers/modal-provider";

export function DashboardPage() {
  const { isAuthenticated } = useAuth();
  const { openLogin } = useModal();

  return (
    <div className="stack-lg">
      <section className="hero-card">
        <span className="eyebrow">Dashboard</span>
        <h1>Start Learning Today</h1>
        <p>
          Day 2 focus: validated forms, cleaner structure, and a static
          dashboard hero that stays aligned with the brief.
        </p>

        <div className="button-row">
          <Link to={ROUTES.COURSES} className="button button-primary">
            Browse Courses
          </Link>
        </div>
      </section>

      {!isAuthenticated ? (
        <section className="section-card">
          <div className="section-header">
            <h2>Continue Learning</h2>
          </div>

          <div className="locked-state-card">
            <div className="placeholder-grid">
              <div className="placeholder-card blurred-card" />
              <div className="placeholder-card blurred-card" />
              <div className="placeholder-card blurred-card" />
            </div>

            <div className="locked-overlay-content">
              <Lock size={22} />
              <h3>Sign in to track your learning progress</h3>
              <button
                type="button"
                className="button button-primary"
                onClick={openLogin}
              >
                Log In
              </button>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
