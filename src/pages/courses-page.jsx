import { Link } from "react-router-dom";
import { ROUTES } from "../shared/constants/routes";

const mockCourses = Array.from({ length: 6 }).map((_, index) => ({
  id: index + 1,
  title: `Course ${index + 1}`,
  category: "Development",
  duration: "6 weeks",
  price: "$120",
}));

export function CoursesPage() {
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
          Day 2 note: Categories/Topics dependency is still not implemented.
          Today only the structure is required.
        </div>
      </aside>

      <section className="section-card">
        <div className="catalog-topbar">
          <select className="input" disabled>
            <option>Newest First</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Most Popular</option>
            <option>Title: A-Z</option>
          </select>

          <p>Showing 6 placeholder courses</p>
        </div>

        <div className="courses-grid">
          {mockCourses.map((course) => (
            <Link
              key={course.id}
              to={ROUTES.courseDetails(course.id)}
              className="course-card"
            >
              <div className="course-image-placeholder">Course Image</div>
              <p>
                <strong>Starting from:</strong> {course.price}
              </p>
              <h3>{course.title}</h3>
              <p>{course.category}</p>
              <p>{course.duration}</p>
            </Link>
          ))}
        </div>

        <div className="pagination-shell">
          <button type="button" className="button button-secondary" disabled>
            Previous
          </button>
          <span>Page 1 of 1</span>
          <button type="button" className="button button-secondary" disabled>
            Next
          </button>
        </div>
      </section>
    </div>
  );
}
