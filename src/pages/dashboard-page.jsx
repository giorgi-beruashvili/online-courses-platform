import { Link } from "react-router-dom";
import { Lock } from "lucide-react";

import { ROUTES } from "../shared/constants/routes";
import { useAuth } from "../app/providers/auth-provider";
import { useModal } from "../app/providers/modal-provider";

const featuredCourses = [
  {
    id: 1,
    title: "React Fundamentals",
    description:
      "Learn the basics of modern React and build interactive user interfaces.",
    instructor: "Nina Carter",
    price: "$120",
  },
  {
    id: 2,
    title: "UI/UX Design Essentials",
    description:
      "Master core design principles and create user-friendly digital experiences.",
    instructor: "Alex Morgan",
    price: "$90",
  },
  {
    id: 3,
    title: "Python Basics",
    description:
      "Start programming with Python and understand core software development concepts.",
    instructor: "David Stone",
    price: "$110",
  },
];

export function DashboardPage() {
  const { isAuthenticated } = useAuth();
  const { openLogin } = useModal();

  return (
    <div className="stack-lg">
      <section className="section-card">
        <div className="section-header">
          <h1>Start Learning Today</h1>
        </div>

        <div className="featured-grid">
          {featuredCourses.map((course) => (
            <article key={course.id} className="featured-card">
              <div className="featured-image-placeholder">Course Image</div>

              <h3>{course.title}</h3>
              <p>{course.description}</p>

              <p>
                <strong>Instructor:</strong> {course.instructor}
              </p>

              <p>
                <strong>Starting from:</strong> {course.price}
              </p>

              <Link
                to={ROUTES.courseDetails(course.id)}
                className="button button-primary"
              >
                View Details
              </Link>
            </article>
          ))}
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
