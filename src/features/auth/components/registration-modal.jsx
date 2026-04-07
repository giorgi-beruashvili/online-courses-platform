import toast from "react-hot-toast";
import { BaseModal } from "../../../shared/components/modal/base-modal";
import { useModal } from "../../../app/providers/modal-provider";
import { useAuth } from "../../../app/providers/auth-provider";

function createDemoRegisteredUser() {
  return {
    id: 2,
    username: "new_learner",
    email: "newlearner@example.com",
    avatar: "",
    fullName: "",
    mobileNumber: "",
    age: null,
    profileComplete: false,
  };
}

export function RegistrationModal({ open }) {
  const { closeModal, openLogin } = useModal();
  const { login } = useAuth();

  const handleDemoRegister = () => {
    login({
      token: "demo-registered-token",
      user: createDemoRegisteredUser(),
    });

    closeModal();
    toast.success("Registered with demo account");
  };

  return (
    <BaseModal
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          closeModal();
        }
      }}
      title="Sign Up"
      description="Day 1 foundation modal. Real validation, avatar preview, and API submit will be added later."
    >
      <div className="stack">
        <label className="field">
          <span className="field-label">Username</span>
          <input
            className="input"
            type="text"
            placeholder="Choose a username"
          />
        </label>

        <label className="field">
          <span className="field-label">Email</span>
          <input
            className="input"
            type="email"
            placeholder="name@example.com"
          />
        </label>

        <label className="field">
          <span className="field-label">Password</span>
          <input
            className="input"
            type="password"
            placeholder="Create a password"
          />
        </label>

        <label className="field">
          <span className="field-label">Confirm Password</span>
          <input
            className="input"
            type="password"
            placeholder="Repeat your password"
          />
        </label>

        <label className="field">
          <span className="field-label">Avatar (optional)</span>
          <input className="input" type="file" accept=".jpg,.jpeg,.png,.webp" />
        </label>

        <button
          type="button"
          className="button button-primary"
          onClick={handleDemoRegister}
        >
          Sign Up as Demo User
        </button>

        <button
          type="button"
          className="button button-secondary"
          onClick={openLogin}
        >
          Already have an account? Log In
        </button>
      </div>
    </BaseModal>
  );
}
