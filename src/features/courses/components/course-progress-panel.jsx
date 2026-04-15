function formatSessionTypeName(name = "") {
  if (name === "in_person") return "In-person";
  if (name === "online") return "Online";
  if (name === "hybrid") return "Hybrid";
  return name || "—";
}

export function CourseProgressPanel({
  enrollment,
  onComplete,
  onRetake,
  isCompleting,
  isRetaking,
}) {
  const isCompleted =
    Boolean(enrollment?.completedAt) ||
    Number(enrollment?.progress ?? 0) >= 100;

  return (
    <div className="stack">
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

      <div className="info-card">
        <strong>Weekly Schedule:</strong>{" "}
        {enrollment.schedule.weeklySchedule?.label || "—"}
      </div>

      <div className="info-card">
        <strong>Time Slot:</strong> {enrollment.schedule.timeSlot?.label || "—"}
      </div>

      <div className="info-card">
        <strong>Session Type:</strong>{" "}
        {formatSessionTypeName(enrollment.schedule.sessionType?.name)}
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

      {!isCompleted ? (
        <button
          type="button"
          className="button button-primary"
          onClick={onComplete}
          disabled={isCompleting}
        >
          {isCompleting ? "Completing..." : "Complete Course"}
        </button>
      ) : (
        <div className="stack">
          <div className="completed-badge">Completed ✓</div>
          <div className="state-note">Course Completed! 🎉</div>

          <button
            type="button"
            className="button button-secondary"
            onClick={onRetake}
            disabled={isRetaking}
          >
            {isRetaking ? "Resetting..." : "Retake Course"}
          </button>
        </div>
      )}
    </div>
  );
}
