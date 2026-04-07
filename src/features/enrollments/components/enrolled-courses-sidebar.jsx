import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useModal } from "../../../app/providers/modal-provider";
import { useAuth } from "../../../app/providers/auth-provider";
import { ROUTES } from "../../../shared/constants/routes";

export function EnrolledCoursesSidebar() {
  const { isEnrolledSidebarOpen, closeEnrolledSidebar, openLogin } = useModal();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isEnrolledSidebarOpen && !isAuthenticated) {
      closeEnrolledSidebar();
      openLogin();
    }
  }, [isEnrolledSidebarOpen, isAuthenticated, closeEnrolledSidebar, openLogin]);

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

        <div className="stack">
          <div className="empty-state-card">
            <h3>Your learning journey starts here!</h3>
            <p>Real enrolled data and progress will be connected later.</p>

            <Link
              to={ROUTES.COURSES}
              className="button button-primary"
              onClick={closeEnrolledSidebar}
            >
              Browse Courses
            </Link>
          </div>

          <div className="summary-card">
            <p>
              <strong>Total Enrolled Courses:</strong> 0
            </p>
            <p>
              <strong>Total Price:</strong> $0
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
