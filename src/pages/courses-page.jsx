import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { ROUTES } from "../shared/constants/routes";
import { QUERY_KEYS } from "../shared/api/query-keys";
import {
  getCourseFilterOptions,
  getCourses,
} from "../features/courses/api/courses.api";
import { Loader } from "../shared/components/ui/loader";
import { ErrorState } from "../shared/components/ui/error-state";
import { EmptyState } from "../shared/components/ui/empty-state";

function toggleIdInArray(items, id) {
  return items.includes(id)
    ? items.filter((item) => item !== id)
    : [...items, id];
}

export function CoursesPage() {
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [selectedInstructors, setSelectedInstructors] = useState([]);
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);

  const {
    data: filterOptions,
    isLoading: isLoadingFilterOptions,
    isError: isFilterOptionsError,
  } = useQuery({
    queryKey: QUERY_KEYS.COURSE_FILTER_OPTIONS,
    queryFn: getCourseFilterOptions,
  });

  const visibleTopics = useMemo(() => {
    const allTopics = filterOptions?.topics ?? [];

    if (selectedCategories.length === 0) {
      return allTopics;
    }

    return allTopics.filter((topic) =>
      selectedCategories.includes(topic.categoryId),
    );
  }, [filterOptions, selectedCategories]);

  useEffect(() => {
    setSelectedTopics((previousTopics) =>
      previousTopics.filter((topicId) =>
        visibleTopics.some((topic) => topic.id === topicId),
      ),
    );
  }, [visibleTopics]);

  const queryParams = useMemo(
    () => ({
      search: search.trim(),
      page,
      sort: sortBy,
      categories: selectedCategories,
      topics: selectedTopics,
      instructors: selectedInstructors,
    }),
    [
      search,
      page,
      sortBy,
      selectedCategories,
      selectedTopics,
      selectedInstructors,
    ],
  );

  const {
    data: coursesResponse,
    isLoading,
    isError,
  } = useQuery({
    queryKey: QUERY_KEYS.COURSES(queryParams),
    queryFn: () => getCourses(queryParams),
  });

  const courses = coursesResponse?.items ?? [];
  const meta = coursesResponse?.meta ?? {
    currentPage: 1,
    lastPage: 1,
    perPage: 0,
    total: 0,
  };

  const pageNumbers = Array.from(
    { length: meta.lastPage || 1 },
    (_, index) => index + 1,
  );

  const activeFiltersCount =
    (search.trim() ? 1 : 0) +
    selectedCategories.length +
    selectedTopics.length +
    selectedInstructors.length;

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handleCategoryToggle = (categoryId) => {
    setSelectedCategories((previous) => toggleIdInArray(previous, categoryId));
    setPage(1);
  };

  const handleTopicToggle = (topicId) => {
    setSelectedTopics((previous) => toggleIdInArray(previous, topicId));
    setPage(1);
  };

  const handleInstructorToggle = (instructorId) => {
    setSelectedInstructors((previous) =>
      toggleIdInArray(previous, instructorId),
    );
    setPage(1);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
    setPage(1);
  };

  const handleClearAll = () => {
    setSearch("");
    setSelectedCategories([]);
    setSelectedTopics([]);
    setSelectedInstructors([]);
    setSortBy("newest");
    setPage(1);
  };

  return (
    <div className="catalog-layout">
      <aside className="section-card sidebar-placeholder">
        <h2>Filter Sidebar</h2>

        {isLoadingFilterOptions ? (
          <Loader label="Loading filter options..." />
        ) : isFilterOptionsError ? (
          <ErrorState title="Failed to load filter options" />
        ) : (
          <>
            <div className="filter-section">
              <h3>Categories</h3>

              {filterOptions.categories.map((category) => (
                <label key={category.id} className="filter-row">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => handleCategoryToggle(category.id)}
                  />
                  <span>{category.name}</span>
                </label>
              ))}
            </div>

            <div className="filter-section">
              <h3>Topics</h3>

              {visibleTopics.map((topic) => (
                <label key={topic.id} className="filter-row">
                  <input
                    type="checkbox"
                    checked={selectedTopics.includes(topic.id)}
                    onChange={() => handleTopicToggle(topic.id)}
                  />
                  <span>{topic.name}</span>
                </label>
              ))}

              <div className="state-note">
                If no category is selected, all topics are shown. If one or more
                categories are selected, only matching topics are shown.
              </div>
            </div>

            <div className="filter-section">
              <h3>Instructors</h3>

              {filterOptions.instructors.map((instructor) => (
                <label key={instructor.id} className="filter-person-row">
                  {instructor.avatar ? (
                    <img
                      src={instructor.avatar}
                      alt={instructor.name}
                      className="mini-avatar-image"
                    />
                  ) : (
                    <span className="mini-avatar" />
                  )}

                  <input
                    type="checkbox"
                    checked={selectedInstructors.includes(instructor.id)}
                    onChange={() => handleInstructorToggle(instructor.id)}
                  />

                  <span>{instructor.name}</span>
                </label>
              ))}
            </div>

            <div className="stack">
              <button
                type="button"
                className="button button-secondary"
                onClick={handleClearAll}
              >
                Clear All Filters
              </button>

              <p>{activeFiltersCount} filters active</p>
            </div>

            <div className="state-note">
              Search is intentionally counted as an active filter in this Day 4
              version.
            </div>

            <div className="state-note">
              Because the API does not expose a dedicated filter metadata
              endpoint, these filter options are derived from a stable
              full-catalog source, not from only the current paginated page.
            </div>
          </>
        )}
      </aside>

      <section className="section-card">
        <div className="catalog-topbar">
          <div className="catalog-controls">
            <input
              className="input"
              type="text"
              placeholder="Search by title or description"
              value={search}
              onChange={handleSearchChange}
            />

            <select
              className="input"
              value={sortBy}
              onChange={handleSortChange}
            >
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="popular">Most Popular</option>
              <option value="title_asc">Title: A-Z</option>
            </select>
          </div>

          <p>
            {meta.total > 0
              ? `Showing ${courses.length} out of ${meta.total}`
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
          <button
            type="button"
            className="button button-secondary"
            onClick={() => setPage((previous) => Math.max(previous - 1, 1))}
            disabled={page === 1}
          >
            Previous
          </button>

          <div className="page-number-list">
            {pageNumbers.map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                className={`page-number-button ${
                  page === pageNumber ? "active" : ""
                }`}
                onClick={() => setPage(pageNumber)}
              >
                {pageNumber}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="button button-secondary"
            onClick={() =>
              setPage((previous) => Math.min(previous + 1, meta.lastPage))
            }
            disabled={page === meta.lastPage}
          >
            Next
          </button>
        </div>

        <div className="state-note">
          API pagination is now interactive. Page resets to `1` on search,
          category, topic, instructor, or sort changes.
        </div>
      </section>
    </div>
  );
}
