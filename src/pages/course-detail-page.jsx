import { useParams } from "react-router-dom";

export function CourseDetailPage() {
  const { courseId } = useParams();

  return (
    <div className="course-detail-layout">
      <section className="section-card">
        <span className="eyebrow">Course Detail</span>
        <h1>Course: {courseId}</h1>
        <p>
          Day 1 note: this is a public detail-page foundation. Real enrollment
          flow will be added in the next step.
        </p>

        <div className="detail-image-placeholder">Course Image Placeholder</div>

        <div className="stack">
          <div className="info-card">
            <strong>Category:</strong> ---
          </div>
          <div className="info-card">
            <strong>Topic:</strong> ---
          </div>
          <div className="info-card">
            <strong>Instructor:</strong> ---
          </div>
          <div className="info-card">
            <strong>Duration:</strong> ---
          </div>
          <div className="info-card">
            <strong>Base Price:</strong> $---
          </div>
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
              <strong>Base Price:</strong> $---
            </p>
            <p>
              <strong>Session Type Modifier:</strong> ---
            </p>
            <p>
              <strong>Total Price:</strong> $---
            </p>
          </div>
        </div>

        <button type="button" className="button button-primary" disabled>
          Enroll Now
        </button>
      </aside>
    </div>
  );
}
