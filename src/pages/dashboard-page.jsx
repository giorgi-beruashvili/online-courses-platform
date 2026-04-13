import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { ROUTES } from "../shared/constants/routes";
import { useAuth } from "../app/providers/auth-provider";
import { useModal } from "../app/providers/modal-provider";
import { QUERY_KEYS } from "../shared/api/query-keys";
import { getFeaturedCourses } from "../features/courses/api/courses.api";
import { Loader } from "../shared/components/ui/loader";
import { ErrorState } from "../shared/components/ui/error-state";
import { EmptyState } from "../shared/components/ui/empty-state";

export function DashboardPage() {
  const { isAuthenticated } = useAuth();
  const { openLogin } = useModal();

  const {
    data: featuredCourses = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: QUERY_KEYS.FEATURED_COURSES,
    queryFn: getFeaturedCourses,
  });

  return (
    <div className="stack-lg">
      <section className="section-card">
        <div className="section-header">
          <h1>Start Learning Today</h1>
        </div>

        {isLoading ? (
          <Loader label="Loading featured courses..." />
        ) : isError ? (
          <ErrorState title="Failed to load featured courses" />
        ) : featuredCourses.length === 0 ? (
          <EmptyState title="No featured courses found" />
        ) : (
          <div className="featured-grid">
            {featuredCourses.slice(0, 3).map((course) => (
              <article key={course.id} className="featured-card">
                {course.image ? (
                  <img
                    src={course.image}
                    alt={course.title}
                    className="card-image"
                  />
                ) : (
                  <div className="featured-image-placeholder">Course Image</div>
                )}

                <h3>{course.title}</h3>
                <p>{course.description}</p>
                <p>
                  <strong>Instructor:</strong>{" "}
                  {course.instructor?.name || "Unknown Instructor"}
                </p>
                <p>
                  <strong>Starting from:</strong> ${course.basePrice}
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
        )}
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
