import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { BaseModal } from "../../../shared/components/modal/base-modal";
import { useModal } from "../../../app/providers/modal-provider";
import { useAuth } from "../../../app/providers/auth-provider";
import { profileSchema } from "../schemas/profile.schema";

const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];
const ageOptions = Array.from({ length: 105 }, (_, index) =>
  String(index + 16),
);

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
}

export function ProfileModal({ open }) {
  const { closeModal } = useModal();
  const { user, setUser, isAuthenticated } = useAuth();
  const [avatarPreview, setAvatarPreview] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: zodResolver(profileSchema),
    mode: "onBlur",
    defaultValues: {
      fullName: "",
      email: "",
      mobileNumber: "",
      age: "",
      avatar: undefined,
    },
  });

  useEffect(() => {
    if (!open || !user) return;

    reset({
      fullName: user.fullName || "",
      email: user.email || "",
      mobileNumber: user.mobileNumber || "",
      age: user.age ? String(user.age) : "",
      avatar: undefined,
    });
  }, [open, user, reset]);

  const displayedAvatarPreview = avatarPreview || user?.avatar || "";

  if (!isAuthenticated) {
    return null;
  }

  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0];

    setValue("avatar", file, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });

    if (!file) {
      setAvatarPreview(user?.avatar || "");
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

  const onSubmit = async (values) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    setUser({
      ...user,
      fullName: values.fullName,
      mobileNumber: values.mobileNumber,
      age: values.age,
      avatar: avatarPreview || user?.avatar || "",
      profileComplete: true,
    });

    toast.success("Profile updated successfully");
    closeModal();
  };

  const handleClose = () => {
    setAvatarPreview("");
    closeModal();
  };

  return (
    <BaseModal
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          handleClose();
        }
      }}
      title="Your Profile"
      description="Day 2: validated profile form with read-only email and optional avatar preparation."
    >
      <form className="stack" onSubmit={handleSubmit(onSubmit)}>
        <label className="field">
          <span className="field-label">Full Name</span>
          <input
            className="input"
            type="text"
            placeholder="Enter your full name"
            {...register("fullName")}
          />
          {errors.fullName ? (
            <span className="field-error">{errors.fullName.message}</span>
          ) : null}
        </label>

        <label className="field">
          <span className="field-label">Email</span>
          <input
            className="input input-disabled"
            type="email"
            readOnly
            {...register("email")}
          />
          {errors.email ? (
            <span className="field-error">{errors.email.message}</span>
          ) : null}
        </label>

        <label className="field">
          <span className="field-label">Mobile Number</span>
          <div className="phone-input-shell">
            <span className="phone-input-prefix">+995</span>
            <input
              className="input phone-input"
              type="text"
              placeholder="555 123 456"
              {...register("mobileNumber")}
            />
          </div>
          {errors.mobileNumber ? (
            <span className="field-error">{errors.mobileNumber.message}</span>
          ) : null}
        </label>

        <label className="field">
          <span className="field-label">Age</span>
          <select className="input" defaultValue="" {...register("age")}>
            <option value="" disabled>
              Select age
            </option>
            {ageOptions.map((age) => (
              <option key={age} value={age}>
                {age}
              </option>
            ))}
          </select>
          {errors.age ? (
            <span className="field-error">{errors.age.message}</span>
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

        {displayedAvatarPreview ? (
          <div className="avatar-preview-card">
            <img
              src={displayedAvatarPreview}
              alt="Profile avatar preview"
              className="avatar-preview-image"
            />
          </div>
        ) : null}

        <button
          type="submit"
          className="button button-primary"
          disabled={isSubmitting || !isValid}
        >
          {isSubmitting ? "Saving Profile..." : "Save Profile"}
        </button>
      </form>
    </BaseModal>
  );
}
