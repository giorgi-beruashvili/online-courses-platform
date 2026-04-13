import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";

import { BaseModal } from "../../../shared/components/modal/base-modal";
import { useModal } from "../../../app/providers/modal-provider";
import { useAuth } from "../../../app/providers/auth-provider";
import { QUERY_KEYS } from "../../../shared/api/query-keys";
import { Loader } from "../../../shared/components/ui/loader";
import { ErrorState } from "../../../shared/components/ui/error-state";
import { profileSchema } from "../schemas/profile.schema";
import { getMe, updateProfile } from "../api/profile.api";

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

export function ProfileModal({ open }) {
  const { closeModal } = useModal();
  const { user, setUser, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
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

  const {
    data: profileData,
    isLoading: isLoadingProfile,
    isError: isProfileError,
    error: profileError,
    refetch: refetchProfile,
  } = useQuery({
    queryKey: QUERY_KEYS.ME,
    queryFn: () => getMe(),
    enabled: open && isAuthenticated,
  });

  useEffect(() => {
    if (!open || !profileData) return;

    reset({
      fullName: profileData.fullName || "",
      email: profileData.email || "",
      mobileNumber: profileData.mobileNumber || "",
      age: profileData.age ? String(profileData.age) : "",
      avatar: undefined,
    });
  }, [open, profileData, reset, setUser]);

  if (!isAuthenticated) {
    return null;
  }

  const displayedAvatarPreview =
    avatarPreview || profileData?.avatar || user?.avatar || "";

  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0];

    setValue("avatar", file, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });

    if (!file) {
      setAvatarPreview(profileData?.avatar || user?.avatar || "");
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
    try {
      await updateProfile(values);

      const me = await getMe();
      setUser(me);
      queryClient.setQueryData(QUERY_KEYS.ME, me);

      toast.success("Profile updated successfully");
      closeModal();
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, "Profile update failed. Please try again."),
      );
    }
  };

  if (isLoadingProfile) {
    return (
      <BaseModal
        open={open}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) closeModal();
        }}
        title="Your Profile"
        description="Loading current profile data from GET /me."
      >
        <Loader label="Loading profile..." />
      </BaseModal>
    );
  }

  if (isProfileError) {
    return (
      <BaseModal
        open={open}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) closeModal();
        }}
        title="Your Profile"
        description="Failed to load profile."
      >
        <ErrorState
          title="Failed to load profile"
          message={getApiErrorMessage(profileError, "Please try again.")}
          action={
            <button
              type="button"
              className="button button-primary"
              onClick={refetchProfile}
            >
              Try Again
            </button>
          }
        />
      </BaseModal>
    );
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
      description="Day 3: canonical profile data from GET /me with mapped FormData update."
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
          <select className="input" {...register("age")}>
            <option value="">Select age</option>
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
