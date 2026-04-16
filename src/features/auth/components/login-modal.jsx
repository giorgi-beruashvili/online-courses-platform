import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";

import { BaseModal } from "../../../shared/components/modal/base-modal";
import { useModal } from "../../../app/providers/modal-provider";
import { useAuth } from "../../../app/providers/auth-provider";
import { QUERY_KEYS } from "../../../shared/api/query-keys";
import { loginSchema } from "../schemas/login.schema";
import { loginUser } from "../api/auth.api";
import { getMe } from "../../profile/api/profile.api";

function getApiErrorMessage(error, fallbackMessage) {
  const validationErrors = error?.response?.data?.errors;
  const firstValidationEntry = validationErrors
    ? Object.values(validationErrors)[0]
    : null;

  if (Array.isArray(firstValidationEntry) && firstValidationEntry[0]) {
    return firstValidationEntry[0];
  }

  return error?.response?.data?.message || fallbackMessage;
}

export function LoginModal({ open }) {
  const { closeModal, openRegister } = useModal();
  const { login, setUser } = useAuth();
  const queryClient = useQueryClient();

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
    try {
      const authPayload = await loginUser(values);

      login({
        token: authPayload.token,
        user: authPayload.user,
      });

      try {
        const me = await getMe(authPayload.token);
        setUser(me);
        queryClient.setQueryData(QUERY_KEYS.ME, me);
      } catch (meError) {
        console.error(
          "Failed to hydrate user from GET /me after login",
          meError,
        );
      }

      toast.success("Logged in successfully");
      reset();
      closeModal();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Login failed. Please try again."));
    }
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
      title="Create Account"
      description="Join and start learning today"
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
          {isSubmitting ? "Logging In..." : "Next"}
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
