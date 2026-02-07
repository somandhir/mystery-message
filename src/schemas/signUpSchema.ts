import { z } from "zod";

export const usernameValidation = z
  .string()
  .trim()
  .min(2, "Username must be at least 2 characters")
  .max(20, "Username must be no more than 20 characters")
  .regex(
    /^[a-zA-Z0-9._]+$/,
    "Username must only contain letters, numbers, underscores, or dots",
  )
  .refine(
    (s) => !s.startsWith(".") && !s.endsWith("."),
    "Username cannot start or end with a dot",
  );

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().trim().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "password must be at least 6 characters" }),
});
