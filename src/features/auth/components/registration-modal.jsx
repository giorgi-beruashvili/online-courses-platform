import { useState } from "react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";

import { BaseModal } from "../../../shared/components/modal/base-modal";
import { useModal } from "../../../app/providers/modal-provider";
import { useAuth } from "../../../app/providers/auth-provider";
import { QUERY_KEYS } from "../../../shared/api/query-keys";
import { registrationSchema } from "../schemas/registration.schema";
import { registerUser } from "../api/auth.api";
import { getMe } from "../../profile/api/profile.api";

const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];
const totalSteps = 3;

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
}

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

export function RegistrationModal({ open }) {
  const { closeModal, openLogin } = useModal();
  const { login, setUser } = useAuth();
  const queryClient = useQueryClient();
  const [avatarPreview, setAvatarPreview] = useState("");
  const [step, setStep] = useState(1);

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors, isSubmitting, isValid },
    reset,
  } = useForm({
    resolver: zodResolver(registrationSchema),
    mode: "onBlur",
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      avatar: undefined,
    },
  });

  const resetFormState = () => {
    reset();
    setAvatarPreview("");
    setStep(1);
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0];

    setValue("avatar", file, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });

    if (!file) {
      setAvatarPreview("");
      return;
    }

    if (!allowedImageTypes.includes(file.type)) {
      setAvatarPreview("");
      return;
    }

    try {
      const preview = await readFileAsDataUrl(file);
      setAvatarPreview(preview);
    } catch (error) {
      console.error("Failed to read avatar file", error);
      setAvatarPreview("");
    }
  };

  const handleNextStep = async () => {
    if (step === 1) {
      const isStepValid = await trigger(["email"]);
      if (!isStepValid) return;
      setStep(2);
      return;
    }

    if (step === 2) {
      const isStepValid = await trigger(["password", "confirmPassword"]);
      if (!isStepValid) return;
      setStep(3);
    }
  };

  const handlePreviousStep = () => {
    setStep((currentStep) => Math.max(1, currentStep - 1));
  };

  const onSubmit = async (values) => {
    try {
      const formData = new FormData();

      formData.append("username", values.username);
      formData.append("email", values.email);
      formData.append("password", values.password);
      formData.append("password_confirmation", values.confirmPassword);

      if (values.avatar instanceof File) {
        formData.append("avatar", values.avatar);
      }

      const authPayload = await registerUser(formData);

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
          "Failed to hydrate user from GET /me after register",
          meError,
        );
      }

      toast.success("Registered successfully");
      resetFormState();
      closeModal();
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, "Registration failed. Please try again."),
      );
    }
  };

  const handleClose = () => {
    resetFormState();
    closeModal();
  };

  const handleSwitchToLogin = () => {
    resetFormState();
    openLogin();
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
      description={`Step ${step} of ${totalSteps}`}
    >
      <form className="stack" onSubmit={handleSubmit(onSubmit)}>
        <div className="step-indicator-row">
          {Array.from({ length: totalSteps }).map((_, index) => {
            const itemStep = index + 1;
            const isActive = itemStep === step;
            const isCompleted = itemStep < step;

            return (
              <span
                key={itemStep}
                className={`step-indicator ${isActive ? "step-indicator-active" : ""} ${
                  isCompleted ? "step-indicator-completed" : ""
                }`}
              />
            );
          })}
        </div>

        {step === 1 ? (
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
        ) : null}

        {step === 2 ? (
          <>
            <label className="field">
              <span className="field-label">Password</span>
              <input
                className="input"
                type="password"
                placeholder="Create a password"
                {...register("password")}
              />
              {errors.password ? (
                <span className="field-error">{errors.password.message}</span>
              ) : null}
            </label>

            <label className="field">
              <span className="field-label">Confirm Password</span>
              <input
                className="input"
                type="password"
                placeholder="Repeat your password"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword ? (
                <span className="field-error">
                  {errors.confirmPassword.message}
                </span>
              ) : null}
            </label>
          </>
        ) : null}

        {step === 3 ? (
          <>
            <label className="field">
              <span className="field-label">Username</span>
              <input
                className="input"
                type="text"
                placeholder="Choose a username"
                {...register("username")}
              />
              {errors.username ? (
                <span className="field-error">{errors.username.message}</span>
              ) : null}
            </label>

            <label className="field">
              <span className="field-label">Avatar (optional)</span>
              <input
                className="input"
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                onChange={handleAvatarChange}
              />
              {errors.avatar ? (
                <span className="field-error">{errors.avatar.message}</span>
              ) : null}
            </label>

            {avatarPreview ? (
              <div className="avatar-preview-card">
                <img
                  src={avatarPreview}
                  alt="Avatar preview"
                  className="avatar-preview-image"
                />
              </div>
            ) : null}
          </>
        ) : null}

        <div className="button-row">
          {step > 1 ? (
            <button
              type="button"
              className="button button-secondary"
              disabled={isSubmitting}
              onClick={handlePreviousStep}
            >
              Back
            </button>
          ) : null}

          {step < totalSteps ? (
            <button
              type="button"
              className="button button-primary"
              disabled={isSubmitting}
              onClick={handleNextStep}
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="button button-primary"
              disabled={isSubmitting || !isValid}
            >
              {isSubmitting ? "Signing Up..." : "Sign Up"}
            </button>
          )}
        </div>

        <button
          type="button"
          className="button button-secondary"
          disabled={isSubmitting}
          onClick={handleSwitchToLogin}
        >
          Already have an account? Log In
        </button>
      </form>
    </BaseModal>
  );
}
