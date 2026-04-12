import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

import { useAuth } from "../app/providers/auth-provider";
import { useModal } from "../app/providers/modal-provider";

export function CourseDetailPage() {
  const { courseId } = useParams();
  const { isAuthenticated, isProfileComplete } = useAuth();
  const { openLogin, openProfile } = useModal();

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

    toast.success("Day 3+ will connect the real enrollment flow here.");
  };

  return (
    <div className="course-detail-layout">
      <section className="section-card">
        <span className="eyebrow">Course Detail</span>
        <h1>Course: {courseId}</h1>
        <p>
          Day 2 note: this page remains public. It still does not assume
          enrollment exists. Future enrolled vs not-enrolled branching will be
          API-driven later.
        </p>

        <div className="detail-image-placeholder">Course Image Placeholder</div>

        <div className="stack">
          <div className="info-card">
            <strong>Category:</strong> Development
          </div>
          <div className="info-card">
            <strong>Topic:</strong> React
          </div>
          <div className="info-card">
            <strong>Instructor:</strong> Nina Carter
          </div>
          <div className="info-card">
            <strong>Duration:</strong> 6 weeks
          </div>
          <div className="info-card">
            <strong>Base Price:</strong> $120
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
              <strong>Base Price:</strong> $120
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
