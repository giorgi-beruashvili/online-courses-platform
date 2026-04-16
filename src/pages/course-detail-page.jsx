import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { ROUTES } from "../shared/constants/routes";
import { QUERY_KEYS } from "../shared/api/query-keys";
import { getCourseDetails } from "../features/courses/api/courses.api";
import {
  completeEnrollment,
  deleteEnrollment,
  rateCourse,
} from "../features/courses/api/course-actions.api";
import { Loader } from "../shared/components/ui/loader";
import { ErrorState } from "../shared/components/ui/error-state";
import { CourseSchedulePanel } from "../features/courses/components/course-schedule-panel";
import { CourseProgressPanel } from "../features/courses/components/course-progress-panel";
import { RatingForm } from "../features/courses/components/rating-form";

function getApiErrorMessage(error, fallbackMessage) {
  const validationErrors = error?.response?.data?.errors;
  const firstValidationEntry = validationErrors
    ? Object.values(validationErrors)[0]
    : null;

  if (Array.isArray(firstValidationEntry) && firstValidationEntry[0]) {
    return firstValidationEntry[0];
  }

  return error?.response?.data?.message || fallbackMessage;
}

function isCompletedEnrollment(enrollment) {
  return (
    Boolean(enrollment?.completedAt) || Number(enrollment?.progress ?? 0) >= 100
  );
}

export function CourseDetailPage() {
  const { courseId } = useParams();
  const queryClient = useQueryClient();
  const [schedulePanelResetKey, setSchedulePanelResetKey] = useState(0);

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

  const completeMutation = useMutation({
    mutationFn: (enrollmentId) => completeEnrollment(enrollmentId),
  });

  const retakeMutation = useMutation({
    mutationFn: (enrollmentId) => deleteEnrollment(enrollmentId),
  });

  const ratingMutation = useMutation({
    mutationFn: (rating) => rateCourse(courseId, rating),
  });

  const invalidateEnrollmentViews = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.COURSE_DETAILS(courseId),
      }),
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.IN_PROGRESS_COURSES,
      }),
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ENROLLMENTS,
      }),
    ]);
  };

  const handleCompleteCourse = async () => {
    const enrollmentId = course?.enrollment?.id;

    if (!enrollmentId) {
      toast.error("No active enrollment found for this course.");
      return;
    }

    try {
      await completeMutation.mutateAsync(enrollmentId);
      toast.success("Course marked as completed");
      await invalidateEnrollmentViews();
    } catch (mutationError) {
      toast.error(
        getApiErrorMessage(mutationError, "Failed to complete the course."),
      );
    }
  };

  const handleRetakeCourse = async () => {
    const enrollmentId = course?.enrollment?.id;

    if (!enrollmentId) {
      toast.error("No active enrollment found for retake.");
      return;
    }

    try {
      await retakeMutation.mutateAsync(enrollmentId);

      setSchedulePanelResetKey((previous) => previous + 1);
      await invalidateEnrollmentViews();

      toast.success(
        "Enrollment removed. The page is back in the not-enrolled state. Choose a fresh schedule and enroll again.",
      );
    } catch (mutationError) {
      toast.error(
        getApiErrorMessage(mutationError, "Failed to reset the enrollment."),
      );
    }
  };

  const handleSubmitRating = async (rating) => {
    try {
      await ratingMutation.mutateAsync(rating);

      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.COURSE_DETAILS(courseId),
      });

      toast.success("Rating submitted successfully");
    } catch (mutationError) {
      toast.error(
        getApiErrorMessage(mutationError, "Failed to submit your rating."),
      );
    }
  };

  const handleEnrollSuccess = async () => {
    await queryClient.refetchQueries({
      queryKey: QUERY_KEYS.COURSE_DETAILS(courseId),
      exact: true,
    });
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
          <div className="button-row">
            <Link to={ROUTES.COURSES} className="button button-primary">
              Browse Courses
            </Link>

            <Link to={ROUTES.HOME} className="button button-secondary">
              Go Back Home
            </Link>
          </div>
        }
      />
    );
  }

  const enrollment = course.enrollment;
  const isCompleted = isCompletedEnrollment(enrollment);

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

            <CourseSchedulePanel
              key={schedulePanelResetKey}
              courseId={course.id}
              basePrice={course.basePrice}
              onEnrollSuccess={handleEnrollSuccess}
            />
          </>
        ) : (
          <>
            <div className="enrolled-badge">Enrolled ✓</div>

            <CourseProgressPanel
              enrollment={enrollment}
              onComplete={handleCompleteCourse}
              onRetake={handleRetakeCourse}
              isCompleting={completeMutation.isPending}
              isRetaking={retakeMutation.isPending}
            />

            <div className="divider-line" />

            {isCompleted ? (
              course.isRated ? (
                <div className="state-note">
                  You've already rated this course
                </div>
              ) : (
                <RatingForm
                  onSubmit={handleSubmitRating}
                  isSubmitting={ratingMutation.isPending}
                />
              )
            ) : null}
          </>
        )}
      </aside>
    </div>
  );
}
