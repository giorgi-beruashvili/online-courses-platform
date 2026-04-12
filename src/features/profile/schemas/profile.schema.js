import { z } from "zod";

const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];

const normalizePhone = (value) => value.replace(/\s+/g, "");

export const profileSchema = z.object({
  fullName: z
    .string()
    .min(1, "Name is required")
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must not exceed 50 characters"),

  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email"),

  mobileNumber: z
    .string()
    .min(1, "Mobile number is required")
    .refine((value) => /^5\d{8}$/.test(normalizePhone(value)), {
      message:
        "Please enter a valid Georgian mobile number (9 digits starting with 5)",
    }),

  age: z
    .string()
    .min(1, "Age is required")
    .refine((value) => /^\d+$/.test(value), {
      message: "Age must be a number",
    })
    .transform((value) => Number(value))
    .refine((value) => value >= 16, {
      message: "You must be at least 16 years old to enroll",
    })
    .refine((value) => value <= 120, {
      message: "Please enter a valid age",
    }),

  avatar: z
    .any()
    .optional()
    .refine((file) => {
      if (!file) return true;
      if (!(file instanceof File)) return false;
      return allowedImageTypes.includes(file.type);
    }, "Avatar must be a JPG, PNG, or WebP image"),
});
