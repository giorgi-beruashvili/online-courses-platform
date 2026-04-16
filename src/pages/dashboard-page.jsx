import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { ROUTES } from "../shared/constants/routes";
import { useAuth } from "../app/providers/auth-provider";
import { useModal } from "../app/providers/modal-provider";
import { QUERY_KEYS } from "../shared/api/query-keys";
import { getFeaturedCourses } from "../features/courses/api/courses.api";
import {
  getEnrollments,
  getInProgressCourses,
} from "../features/enrollments/api/enrollments.api";
import { Loader } from "../shared/components/ui/loader";
import { ErrorState } from "../shared/components/ui/error-state";
import { EmptyState } from "../shared/components/ui/empty-state";
import HeroSlider from "../shared/components/hero-slider/hero-slider";

export function DashboardPage() {
  const { isAuthenticated } = useAuth();
  const { openLogin, openEnrolledSidebar } = useModal();

  const {
    data: featuredCourses = [],
    isLoading: isLoadingFeatured,
    isError: isFeaturedError,
  } = useQuery({
    queryKey: QUERY_KEYS.FEATURED_COURSES,
    queryFn: getFeaturedCourses,
  });

  const {
    data: inProgressCourses = [],
    isLoading: isLoadingInProgress,
    isError: isInProgressError,
  } = useQuery({
    queryKey: QUERY_KEYS.IN_PROGRESS_COURSES,
    queryFn: getInProgressCourses,
    enabled: isAuthenticated,
  });

  const { data: allEnrollments = [] } = useQuery({
    queryKey: QUERY_KEYS.ENROLLMENTS,
    queryFn: getEnrollments,
    enabled: isAuthenticated,
  });

  const displayedInProgressCourses = useMemo(
    () => inProgressCourses.slice(0, 4),
    [inProgressCourses],
  );

  const actualInProgressCount = useMemo(
    () =>
      allEnrollments.filter((item) => Number(item.progress ?? 0) < 100).length,
    [allEnrollments],
  );

  const shouldShowSeeAll =
    actualInProgressCount > displayedInProgressCourses.length;

  const shouldRenderContinueLearning =
    !isAuthenticated ||
    isLoadingInProgress ||
    isInProgressError ||
    displayedInProgressCourses.length > 0;

  return (
    <div className="stack-lg">
      <HeroSlider />

      <section className="section-card">
        <div className="section-header">
          <h1>Start Learning Today</h1>
        </div>

        {isLoadingFeatured ? (
          <Loader label="Loading featured courses..." />
        ) : isFeaturedError ? (
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

      {shouldRenderContinueLearning ? (
        <section className="section-card">
          <div className="section-header section-header-row">
            <h2>Continue Learning</h2>

            {isAuthenticated && shouldShowSeeAll ? (
              <button
                type="button"
                className="button button-secondary"
                onClick={openEnrolledSidebar}
              >
                See All
              </button>
            ) : null}
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
          ) : isLoadingInProgress ? (
            <Loader label="Loading in-progress courses..." />
          ) : isInProgressError ? (
            <ErrorState title="Failed to load in-progress courses" />
          ) : (
            <>
              <div className="featured-grid">
                {displayedInProgressCourses.map((enrollment) => (
                  <article key={enrollment.id} className="featured-card">
                    {enrollment.course?.image ? (
                      <img
                        src={enrollment.course.image}
                        alt={enrollment.course.title}
                        className="card-image"
                      />
                    ) : (
                      <div className="featured-image-placeholder">
                        Course Image
                      </div>
                    )}

                    <h3>{enrollment.course?.title || "Untitled Course"}</h3>

                    <p>
                      <strong>Instructor:</strong>{" "}
                      {enrollment.course?.instructor?.name ||
                        "Unknown Instructor"}
                    </p>

                    <div className="stack">
                      <span>{enrollment.progress}% Complete</span>

                      <div className="progress-bar-shell">
                        <div
                          className="progress-bar-fill"
                          style={{ width: `${enrollment.progress}%` }}
                        />
                      </div>
                    </div>

                    <Link
                      to={ROUTES.courseDetails(enrollment.course?.id)}
                      className="button button-primary"
                    >
                      Continue
                    </Link>
                  </article>
                ))}
              </div>
            </>
          )}
        </section>
      ) : null}
    </div>
  );
}
