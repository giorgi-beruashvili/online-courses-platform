import { Link } from "react-router-dom";
import { Lock } from "lucide-react";

import { ROUTES } from "../shared/constants/routes";

export function DashboardPage() {
  return (
    <div className="stack-lg">
      <section className="hero-card">
        <span className="eyebrow">Dashboard</span>
        <h1>Start Learning Today</h1>
        <p>Day 1 foundation: public dashboard structure and starter layout.</p>

        <div className="button-row">
          <Link to={ROUTES.COURSES} className="button button-primary">
            Browse Courses
          </Link>
        </div>
      </section>

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
            <h3>Authentication flow will be added in the next step</h3>
          </div>
        </div>
      </section>
    </div>
  );
}
