import { Link } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { ROUTES } from "../../../shared/constants/routes";
import { useModal } from "../../../app/providers/modal-provider";
import { useAuth } from "../../../app/providers/auth-provider";
import { QUERY_KEYS } from "../../../shared/api/query-keys";
import { getEnrollments } from "../api/enrollments.api";
import { Loader } from "../../../shared/components/ui/loader";
import { ErrorState } from "../../../shared/components/ui/error-state";
import { EmptyState } from "../../../shared/components/ui/empty-state";

function formatSessionTypeName(name = "") {
  if (name === "in_person") return "In-person";
  if (name === "online") return "Online";
  if (name === "hybrid") return "Hybrid";
  return name || "—";
}

export function EnrolledCoursesSidebar() {
  const { isEnrolledSidebarOpen, closeEnrolledSidebar, openLogin } = useModal();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isEnrolledSidebarOpen && !isAuthenticated) {
      closeEnrolledSidebar();
      openLogin();
    }
  }, [isEnrolledSidebarOpen, isAuthenticated, closeEnrolledSidebar, openLogin]);

  const {
    data: enrollments = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: QUERY_KEYS.ENROLLMENTS,
    queryFn: getEnrollments,
    enabled: isEnrolledSidebarOpen && isAuthenticated,
  });

  const summary = useMemo(() => {
    const totalCombinedPrice = enrollments.reduce(
      (sum, item) => sum + Number(item.totalPrice ?? 0),
      0,
    );

    return {
      totalCombinedPrice,
      totalCount: enrollments.length,
    };
  }, [enrollments]);

  if (!isEnrolledSidebarOpen || !isAuthenticated) {
    return null;
  }

  return (
    <>
      <div className="drawer-overlay" onClick={closeEnrolledSidebar} />

      <aside className="drawer">
        <div className="drawer-header">
          <h2>Enrolled Courses</h2>
          <button
            type="button"
            className="icon-button"
            onClick={closeEnrolledSidebar}
          >
            ✕
          </button>
        </div>

        {isLoading ? (
          <Loader label="Loading enrolled courses..." />
        ) : isError ? (
          <ErrorState title="Failed to load enrolled courses" />
        ) : enrollments.length === 0 ? (
          <EmptyState
            title="Your learning journey starts here!"
            message="Browse courses to get started."
            action={
              <Link
                to={ROUTES.COURSES}
                className="button button-primary"
                onClick={closeEnrolledSidebar}
              >
                Browse Courses
              </Link>
            }
          />
        ) : (
          <div className="stack">
            <div className="summary-card">
              <p>
                <strong>Total Enrolled Courses:</strong> {summary.totalCount}
              </p>
              <p>
                <strong>Total Price:</strong> ${summary.totalCombinedPrice}
              </p>
            </div>

            <div className="sidebar-list">
              {enrollments.map((enrollment) => {
                const isCompleted =
                  Boolean(enrollment.completedAt) ||
                  Number(enrollment.progress) >= 100;

                return (
                  <div key={enrollment.id} className="sidebar-item-card">
                    <div className="sidebar-item-top">
                      {enrollment.course?.image ? (
                        <img
                          src={enrollment.course.image}
                          alt={enrollment.course.title}
                          className="sidebar-item-image"
                        />
                      ) : (
                        <div className="sidebar-item-image placeholder" />
                      )}

                      <div className="stack">
                        <strong>
                          {enrollment.course?.title || "Untitled Course"}
                        </strong>

                        {enrollment.quantity > 1 ? (
                          <span>Quantity: {enrollment.quantity}</span>
                        ) : null}

                        <span>Final Price: ${enrollment.totalPrice}</span>

                        <span>
                          Weekly Schedule:{" "}
                          {enrollment.schedule.weeklySchedule?.label || "—"}
                        </span>

                        <span>
                          Time Slot:{" "}
                          {enrollment.schedule.timeSlot?.label || "—"}
                        </span>

                        <span>
                          Session Type:{" "}
                          {formatSessionTypeName(
                            enrollment.schedule.sessionType?.name,
                          )}
                        </span>

                        {enrollment.location ? (
                          <span>Location: {enrollment.location}</span>
                        ) : null}

                        <span>
                          {isCompleted ? "Completed ✓" : "In Progress"}
                        </span>
                      </div>
                    </div>

                    <div className="stack">
                      <span>Progress: {enrollment.progress}%</span>

                      <div className="progress-bar-shell">
                        <div
                          className="progress-bar-fill"
                          style={{ width: `${enrollment.progress}%` }}
                        />
                      </div>

                      <Link
                        to={ROUTES.courseDetails(enrollment.course?.id)}
                        className="button button-secondary"
                        onClick={closeEnrolledSidebar}
                      >
                        View Course
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
