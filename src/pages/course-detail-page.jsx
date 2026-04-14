import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { ROUTES } from "../shared/constants/routes";
import { QUERY_KEYS } from "../shared/api/query-keys";
import { getCourseDetails } from "../features/courses/api/courses.api";
import { Loader } from "../shared/components/ui/loader";
import { ErrorState } from "../shared/components/ui/error-state";
import { CourseSchedulePanel } from "../features/courses/components/course-schedule-panel";

export function CourseDetailPage() {
  const { courseId } = useParams();

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

  const enrollment = course.enrollment;

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
        </div>
      </section>

      <aside className="section-card">
        {!enrollment ? (
          <>
            <h2>Enrollment Panel</h2>

            <div className="state-note">
              Schedule browsing is public on Day 4. Only the final enroll submit
              action is protected.
            </div>

            <CourseSchedulePanel
              courseId={course.id}
              basePrice={course.basePrice}
              onEnrollSuccess={() => {}}
            />
          </>
        ) : (
          <>
            <div className="enrolled-badge">Enrolled ✓</div>

            <div className="stack">
              <div className="info-card">
                <strong>Selected Weekly Schedule:</strong>{" "}
                {enrollment.schedule.weeklySchedule?.label || "—"}
              </div>

              <div className="info-card">
                <strong>Selected Time Slot:</strong>{" "}
                {enrollment.schedule.timeSlot?.label || "—"}
              </div>

              <div className="info-card">
                <strong>Selected Session Type:</strong>{" "}
                {enrollment.schedule.sessionType?.name || "—"}
              </div>

              {enrollment.location ? (
                <div className="info-card">
                  <strong>Location:</strong> {enrollment.location}
                </div>
              ) : null}

              <div className="summary-card">
                <p>
                  <strong>Total Price:</strong> ${enrollment.totalPrice}
                </p>
                <p>
                  <strong>Enrollment ID:</strong> {enrollment.id}
                </p>
              </div>

              <div>
                <p>
                  <strong>Course Progress:</strong> {enrollment.progress}%
                </p>
                <div className="progress-bar-shell">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${enrollment.progress}%` }}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
