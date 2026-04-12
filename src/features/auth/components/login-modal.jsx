import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { BaseModal } from "../../../shared/components/modal/base-modal";
import { useModal } from "../../../app/providers/modal-provider";
import { useAuth } from "../../../app/providers/auth-provider";
import { loginSchema } from "../schemas/login.schema";

function createDemoLoginUser(email) {
  return {
    id: 1,
    username: email.split("@")[0],
    email,
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

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    login({
      token: "demo-token",
      user: createDemoLoginUser(values.email),
    });

    toast.success("Logged in successfully");
    reset();
    closeModal();
  };

  const handleClose = () => {
    reset();
    closeModal();
  };

  const handleSwitchToRegister = () => {
    reset();
    openRegister();
  };

  return (
    <BaseModal
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          handleClose();
        }
      }}
      title="Log In"
      description="Day 2: real form UX and validation. API submit will come later."
    >
      <form className="stack" onSubmit={handleSubmit(onSubmit)}>
        <label className="field">
          <span className="field-label">Email</span>
          <input
            className="input"
            type="email"
            placeholder="name@example.com"
            {...register("email")}
          />
          {errors.email ? (
            <span className="field-error">{errors.email.message}</span>
          ) : null}
        </label>

        <label className="field">
          <span className="field-label">Password</span>
          <input
            className="input"
            type="password"
            placeholder="Enter your password"
            {...register("password")}
          />
          {errors.password ? (
            <span className="field-error">{errors.password.message}</span>
          ) : null}
        </label>

        <button
          type="submit"
          className="button button-primary"
          disabled={isSubmitting || !isValid}
        >
          {isSubmitting ? "Logging In..." : "Log In"}
        </button>

        <button
          type="button"
          className="button button-secondary"
          disabled={isSubmitting}
          onClick={handleSwitchToRegister}
        >
          Don&apos;t have an account? Sign Up
        </button>
      </form>
    </BaseModal>
  );
}
