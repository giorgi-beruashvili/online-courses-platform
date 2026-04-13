import { Link } from "react-router-dom";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { ROUTES } from "../shared/constants/routes";
import { QUERY_KEYS } from "../shared/api/query-keys";
import { getCourses } from "../features/courses/api/courses.api";
import { Loader } from "../shared/components/ui/loader";
import { ErrorState } from "../shared/components/ui/error-state";
import { EmptyState } from "../shared/components/ui/empty-state";

export function CoursesPage() {
  const initialParams = useMemo(
    () => ({
      page: 1,
      sort: "newest",
    }),
    [],
  );

  const {
    data: coursesResponse,
    isLoading,
    isError,
  } = useQuery({
    queryKey: QUERY_KEYS.COURSES(initialParams),
    queryFn: () => getCourses(initialParams),
  });

  const courses = coursesResponse?.items ?? [];
  const meta = coursesResponse?.meta ?? {
    currentPage: 1,
    lastPage: 1,
    perPage: 0,
    total: 0,
  };

  return (
    <div className="catalog-layout">
      <aside className="section-card sidebar-placeholder">
        <h2>Filter Sidebar</h2>

        <div className="filter-section">
          <h3>Categories</h3>
          <label className="filter-row">
            <input type="checkbox" disabled /> Development
          </label>
          <label className="filter-row">
            <input type="checkbox" disabled /> Design
          </label>
          <label className="filter-row">
            <input type="checkbox" disabled /> Business
          </label>
        </div>

        <div className="filter-section">
          <h3>Topics</h3>
          <label className="filter-row">
            <input type="checkbox" disabled /> React
          </label>
          <label className="filter-row">
            <input type="checkbox" disabled /> Python
          </label>
          <label className="filter-row">
            <input type="checkbox" disabled /> UI/UX
          </label>
        </div>

        <div className="filter-section">
          <h3>Instructors</h3>

          <label className="filter-person-row">
            <span className="mini-avatar" />
            <input type="checkbox" disabled />
            <span>Nina Carter</span>
          </label>

          <label className="filter-person-row">
            <span className="mini-avatar" />
            <input type="checkbox" disabled />
            <span>Alex Morgan</span>
          </label>

          <label className="filter-person-row">
            <span className="mini-avatar" />
            <input type="checkbox" disabled />
            <span>David Stone</span>
          </label>
        </div>

        <div className="stack">
          <button type="button" className="button button-secondary" disabled>
            Clear All Filters
          </button>
          <p>0 filters active</p>
        </div>

        <div className="state-note">
          Day 3 note: filter/sort/pagination controls are still visual only.
          Real interaction comes on Day 4.
        </div>
      </aside>

      <section className="section-card">
        <div className="catalog-topbar">
          <select className="input" defaultValue="newest" disabled>
            <option value="newest">Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="popular">Most Popular</option>
            <option value="title_asc">Title: A-Z</option>
          </select>

          <p>
            {courses.length > 0
              ? `Showing ${courses.length} courses`
              : "No courses found"}
          </p>
        </div>

        {isLoading ? (
          <Loader label="Loading courses..." />
        ) : isError ? (
          <ErrorState title="Failed to load courses" />
        ) : courses.length === 0 ? (
          <EmptyState title="No courses found" />
        ) : (
          <div className="courses-grid">
            {courses.map((course) => (
              <Link
                key={course.id}
                to={ROUTES.courseDetails(course.id)}
                className="course-card"
              >
                {course.image ? (
                  <img
                    src={course.image}
                    alt={course.title}
                    className="card-image"
                  />
                ) : (
                  <div className="course-image-placeholder">Course Image</div>
                )}

                <p>
                  <strong>Starting from:</strong> ${course.basePrice}
                </p>
                <h3>{course.title}</h3>
                <p>{course.category?.name || "Uncategorized"}</p>
                <p>{course.durationWeeks} weeks</p>
              </Link>
            ))}
          </div>
        )}

        <div className="pagination-shell">
          <button type="button" className="button button-secondary" disabled>
            Previous
          </button>
          <span>
            Page {meta.currentPage} of {meta.lastPage}
          </span>
          <button type="button" className="button button-secondary" disabled>
            Next
          </button>
        </div>

        <div className="state-note">
          Pagination meta is shown visually on Day 3, but controls remain
          non-interactive until Day 4.
        </div>
      </section>
    </div>
  );
}
