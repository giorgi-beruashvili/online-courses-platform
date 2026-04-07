import toast from "react-hot-toast";
import { BaseModal } from "../../../shared/components/modal/base-modal";
import { useModal } from "../../../app/providers/modal-provider";
import { useAuth } from "../../../app/providers/auth-provider";

function createDemoLoginUser() {
  return {
    id: 1,
    username: "demo_user",
    email: "demo@example.com",
    avatar: "",
    fullName: "",
    mobileNumber: "",
    age: null,
    profileComplete: false,
  };
}

export function LoginModal({ open }) {
  const { closeModal, openRegister } = useModal();
  const { login } = useAuth();

  const handleDemoLogin = () => {
    login({
      token: "demo-token",
      user: createDemoLoginUser(),
    });

    closeModal();
    toast.success("Logged in with demo account");
  };

  return (
    <BaseModal
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          closeModal();
        }
      }}
      title="Log In"
      description="Day 1 foundation modal. Real validation and API submit will be added later."
    >
      <div className="stack">
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
            placeholder="Enter your password"
          />
        </label>

        <button
          type="button"
          className="button button-primary"
          onClick={handleDemoLogin}
        >
          Log In as Demo User
        </button>

        <button
          type="button"
          className="button button-secondary"
          onClick={openRegister}
        >
          Don&apos;t have an account? Sign Up
        </button>
      </div>
    </BaseModal>
  );
}
