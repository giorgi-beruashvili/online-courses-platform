import { Link } from "react-router-dom";
import { ROUTES } from "../shared/constants/routes";

export function CoursesPage() {
  return (
    <div className="catalog-layout">
      <aside className="section-card sidebar-placeholder">
        <h2>Filter Sidebar</h2>

        <div className="filter-section">
          <h3>Categories</h3>
          <label>
            <input type="checkbox" disabled /> Development
          </label>
          <label>
            <input type="checkbox" disabled /> Design
          </label>
          <label>
            <input type="checkbox" disabled /> Business
          </label>
        </div>

        <div className="filter-section">
          <h3>Topics</h3>
          <label>
            <input type="checkbox" disabled /> React
          </label>
          <label>
            <input type="checkbox" disabled /> Python
          </label>
          <label>
            <input type="checkbox" disabled /> UI/UX
          </label>
        </div>

        <div className="filter-section">
          <h3>Instructors</h3>
          <label>
            <input type="checkbox" disabled /> Nina Carter
          </label>
          <label>
            <input type="checkbox" disabled /> Alex Morgan
          </label>
          <label>
            <input type="checkbox" disabled /> David Stone
          </label>
        </div>

        <div className="state-note">
          Day 1 note: Categories/Topics dependency is not implemented yet. This
          page only establishes the structural placeholder.
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

          <p>Showing placeholder courses</p>
        </div>

        <div className="courses-grid">
          <Link to={ROUTES.courseDetails(1)} className="course-card">
            <div className="course-image-placeholder">Course Image</div>
            <p>
              <strong>Starting from:</strong> $---
            </p>
            <h3>React Fundamentals</h3>
            <p>Development</p>
            <p>6 weeks</p>
          </Link>

          <div className="course-card">
            <div className="course-image-placeholder">Course Image</div>
            <p>
              <strong>Starting from:</strong> $---
            </p>
            <h3>Placeholder Course</h3>
            <p>Category</p>
            <p>Duration</p>
          </div>

          <div className="course-card">
            <div className="course-image-placeholder">Course Image</div>
            <p>
              <strong>Starting from:</strong> $---
            </p>
            <h3>Placeholder Course</h3>
            <p>Category</p>
            <p>Duration</p>
          </div>
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
