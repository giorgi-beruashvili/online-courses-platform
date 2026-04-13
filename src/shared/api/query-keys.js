export const QUERY_KEYS = {
  FEATURED_COURSES: ["featured-courses"],
  COURSES: (params) => ["courses", params],
  COURSE_DETAILS: (courseId) => ["course-details", courseId],
  ME: ["me"],
};
