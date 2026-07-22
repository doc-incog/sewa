import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  email: z.string().email("Invalid email address").optional(),
  phone: z.string().min(10, "Phone number must be at least 10 digits").max(15, "Phone number is too long"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const providerSignupSchema = signupSchema.extend({
  businessName: z.string().min(2, "Business name must be at least 2 characters").max(100),
  description: z.string().optional(),
});

export const loginSchema = z.object({
  identifier: z.string().min(1, "Email or phone number is required"),
  password: z.string().min(1, "Password is required"),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});
