import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { ROUTES } from "../shared/constants/routes";
import { useAuth } from "../app/providers/auth-provider";
import { useModal } from "../app/providers/modal-provider";
import { QUERY_KEYS } from "../shared/api/query-keys";
import { getCourseDetails } from "../features/courses/api/courses.api";
import { Loader } from "../shared/components/ui/loader";
import { ErrorState } from "../shared/components/ui/error-state";

export function CourseDetailPage() {
  const { courseId } = useParams();
  const { isAuthenticated, isProfileComplete } = useAuth();
  const { openLogin, openProfile } = useModal();

  const {
    data: course,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: QUERY_KEYS.COURSE_DETAILS(courseId),
    queryFn: () => getCourseDetails(courseId),
    enabled: Boolean(courseId),
  });

  const handleProtectedEnroll = () => {
    if (!isAuthenticated) {
      openLogin();
      return;
    }

    if (!isProfileComplete) {
      toast.error("Please complete your profile to enroll in courses");
      openProfile();
      return;
    }

    toast.success("Day 4 will connect the real enrollment flow here.");
  };

  if (isLoading) {
    return <Loader label="Loading course details..." />;
  }

  if (isError) {
    const isNotFound = error?.response?.status === 404;

    return (
      <ErrorState
        title={
          isNotFound ? "Course Not Found" : "Failed to load course details"
        }
        message={
          isNotFound
            ? "The requested course could not be found."
            : "Please try again."
        }
        action={
          <Link to={ROUTES.COURSES} className="button button-primary">
            Browse Courses
          </Link>
        }
      />
    );
  }

  return (
    <div className="course-detail-layout">
      <section className="section-card">
        <span className="eyebrow">Course Detail</span>
        <h1>{course.title}</h1>
        <p>{course.description}</p>

        {course.image ? (
          <img
            src={course.image}
            alt={course.title}
            className="detail-page-image"
          />
        ) : (
          <div className="detail-image-placeholder">
            Course Image Placeholder
          </div>
        )}

        <div className="stack">
          <div className="info-card">
            <strong>Category:</strong>{" "}
            {course.category?.name || "Uncategorized"}
          </div>
          <div className="info-card">
            <strong>Topic:</strong> {course.topic?.name || "Unknown Topic"}
          </div>
          <div className="info-card">
            <strong>Instructor:</strong>{" "}
            {course.instructor?.name || "Unknown Instructor"}
          </div>
          <div className="info-card">
            <strong>Duration:</strong> {course.durationWeeks} weeks
          </div>
          <div className="info-card">
            <strong>Base Price:</strong> ${course.basePrice}
          </div>

          {course.enrollment ? (
            <div className="info-card">
              <strong>Enrollment:</strong> Enrollment data exists for this user.
              Full enrolled/not-enrolled UI branching will be added later.
            </div>
          ) : (
            <div className="state-note">
              Day 3 note: no enrollment is assumed for guests or not-enrolled
              users.
            </div>
          )}
        </div>
      </section>

      <aside className="section-card">
        <h2>Enrollment Panel</h2>

        <div className="stack">
          <div className="info-card">Weekly Schedule selector comes later</div>
          <div className="info-card">Time Slot selector comes later</div>
          <div className="info-card">Session Type selector comes later</div>

          <div className="summary-card">
            <p>
              <strong>Base Price:</strong> ${course.basePrice}
            </p>
            <p>
              <strong>Session Type Modifier:</strong> ---
            </p>
            <p>
              <strong>Total Price:</strong> $---
            </p>
          </div>
        </div>

        <button
          type="button"
          className="button button-primary"
          onClick={handleProtectedEnroll}
        >
          Enroll Now
        </button>
      </aside>
    </div>
  );
}
