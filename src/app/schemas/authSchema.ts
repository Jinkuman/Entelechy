import { z } from "zod";

export const signInSchema = z.object({
  email: z
    .string({ required_error: "Required" })
    .email("Invalid Email Address"),
  password: z
    .string({ required_error: "Required" })
    .min(8, "Password must be at least 8 characters long"),
});

export type signInForm = z.infer<typeof signInSchema>;

export const signUpSchema = signInSchema
  .extend({
    name: z.string().min(1, "Name must be longer than one letter"),
    confirmPassword: z.string().min(8, "Must be at least 8 characters long"),
  })
  .refine((data) => data.password == data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type signUpForm = z.infer<typeof signUpSchema>;
