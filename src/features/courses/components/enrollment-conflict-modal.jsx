import { BaseModal } from "../../../shared/components/modal/base-modal";

export function EnrollmentConflictModal({
  open,
  conflicts,
  onCancel,
  onContinue,
  isSubmitting,
}) {
  return (
    <BaseModal
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onCancel();
        }
      }}
      title="Schedule Conflict"
      description="You are already enrolled in another course with the same schedule."
    >
      <div className="stack">
        {(conflicts ?? []).map((conflict) => (
          <div key={conflict.conflictingEnrollmentId} className="conflict-card">
            <p>
              You are already enrolled in{" "}
              <strong>{conflict.conflictingCourseName}</strong> with the same
              schedule:
            </p>
            <p>{conflict.schedule}</p>
          </div>
        ))}

        <div className="button-row">
          <button
            type="button"
            className="button button-secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>

          <button
            type="button"
            className="button button-primary"
            onClick={onContinue}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Continuing..." : "Continue Anyway"}
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
