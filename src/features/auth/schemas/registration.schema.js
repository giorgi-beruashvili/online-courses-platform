import { z } from "zod";

const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];

export const registrationSchema = z
  .object({
    username: z
      .string()
      .min(1, "Username is required")
      .min(3, "Username must be at least 3 characters"),

    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email"),

    password: z
      .string()
      .min(1, "Password is required")
      .min(3, "Password must be at least 3 characters"),

    confirmPassword: z.string().min(1, "Please confirm your password"),

    avatar: z
      .any()
      .optional()
      .refine((file) => {
        if (!file) return true;
        if (!(file instanceof File)) return false;
        return allowedImageTypes.includes(file.type);
      }, "Avatar must be a JPG, PNG, or WebP image"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });
