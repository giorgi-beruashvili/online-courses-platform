import { Link } from "react-router-dom";
import { Lock } from "lucide-react";

import { ROUTES } from "../shared/constants/routes";
import { useAuth } from "../app/providers/auth-provider";
import { useModal } from "../app/providers/modal-provider";

export function DashboardPage() {
  const { isAuthenticated } = useAuth();
  const { openLogin, openRegister, openProfile, openEnrolledSidebar } =
    useModal();

  return (
    <div className="stack-lg">
      <section className="hero-card">
        <span className="eyebrow">Dashboard</span>
        <h1>Start Learning Today</h1>
        <p>
          Day 1 foundation: public dashboard structure, modal flow, auth
          persistence, and protected action groundwork.
        </p>

        <div className="button-row">
          <Link to={ROUTES.COURSES} className="button button-primary">
            Browse Courses
          </Link>

          {!isAuthenticated ? (
            <>
              <button
                type="button"
                className="button button-secondary"
                onClick={openLogin}
              >
                Open Login Modal
              </button>

              <button
                type="button"
                className="button button-secondary"
                onClick={openRegister}
              >
                Open Registration Modal
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="button button-secondary"
                onClick={openProfile}
              >
                Open Profile Modal
              </button>

              <button
                type="button"
                className="button button-secondary"
                onClick={openEnrolledSidebar}
              >
                Open Enrolled Sidebar
              </button>
            </>
          )}
        </div>
      </section>

      <section className="section-card">
        <div className="section-header">
          <h2>Continue Learning</h2>
        </div>

        {!isAuthenticated ? (
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
        ) : (
          <div className="empty-state-card">
            <h3>You haven&apos;t enrolled in any courses yet.</h3>
            <p>Start your learning journey today!</p>
            <Link to={ROUTES.COURSES} className="button button-primary">
              Browse Courses
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
