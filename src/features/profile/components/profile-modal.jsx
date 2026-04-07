import toast from "react-hot-toast";
import { BaseModal } from "../../../shared/components/modal/base-modal";
import { useModal } from "../../../app/providers/modal-provider";
import { useAuth } from "../../../app/providers/auth-provider";

export function ProfileModal({ open }) {
  const { closeModal } = useModal();
  const { user, setUser, isAuthenticated } = useAuth();

  const handleCompleteDemoProfile = () => {
    if (!user) return;

    setUser({
      ...user,
      fullName: "Demo Learner",
      mobileNumber: "555123456",
      age: 22,
      avatar: "",
      profileComplete: true,
    });

    closeModal();
    toast.success("Demo profile completed");
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <BaseModal
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          closeModal();
        }
      }}
      title="Your Profile"
      description="This is a Day 1 profile foundation modal. Real fields, GET /me, and PUT /profile will be connected later."
    >
      <div className="stack">
        <div className="info-card">
          <p>
            <strong>Email:</strong> {user?.email || "-"}
          </p>
          <p>
            <strong>Avatar:</strong> {user?.avatar || "(not set yet)"}
          </p>
          <p>
            <strong>Full Name:</strong> {user?.fullName || "-"}
          </p>
          <p>
            <strong>Mobile Number:</strong> {user?.mobileNumber || "-"}
          </p>
          <p>
            <strong>Age:</strong> {user?.age ?? "-"}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            {user?.profileComplete ? "Profile Complete" : "Profile Incomplete"}
          </p>
        </div>

        <button
          type="button"
          className="button button-primary"
          onClick={handleCompleteDemoProfile}
        >
          Save Demo Profile
        </button>

        <button
          type="button"
          className="button button-secondary"
          onClick={closeModal}
        >
          Close
        </button>
      </div>
    </BaseModal>
  );
}
