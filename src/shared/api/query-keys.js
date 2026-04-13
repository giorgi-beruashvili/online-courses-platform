export const QUERY_KEYS = {
  FEATURED_COURSES: ["featured-courses"],
  COURSE_FILTER_OPTIONS: ["course-filter-options"],
  COURSES: (params) => ["courses", params],
  COURSE_DETAILS: (courseId) => ["course-details", courseId],
  COURSE_SCHEDULES: (courseId) => ["course-schedules", courseId],
  COURSE_TIME_SLOTS: (courseId, weeklyScheduleId) => [
    "course-time-slots",
    courseId,
    weeklyScheduleId,
  ],
  COURSE_SESSION_TYPES: (courseId, weeklyScheduleId, timeSlotId) => [
    "course-session-types",
    courseId,
    weeklyScheduleId,
    timeSlotId,
  ],
  ENROLLMENTS: ["enrollments"],
  IN_PROGRESS_COURSES: ["in-progress-courses"],
  ME: ["me"],
};
