import { useState } from "react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { BaseModal } from "../../../shared/components/modal/base-modal";
import { useModal } from "../../../app/providers/modal-provider";
import { useAuth } from "../../../app/providers/auth-provider";
import { registrationSchema } from "../schemas/registration.schema";

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

export function RegistrationModal({ open }) {
  const { closeModal, openLogin } = useModal();
  const { login } = useAuth();
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
    await new Promise((resolve) => setTimeout(resolve, 500));

    login({
      token: "demo-registered-token",
      user: {
        id: 2,
        username: values.username,
        email: values.email,
        avatar: avatarPreview || "",
        fullName: "",
        mobileNumber: "",
        age: null,
        profileComplete: false,
      },
    });

    toast.success("Registered successfully");
    resetFormState();
    closeModal();
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
