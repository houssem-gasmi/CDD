import { z } from "zod";

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(6, { message: "old password should be minimum of 6 characters" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
    confirmPassword: z.string().min(6, { message: "password must be at least 6 characters long" }),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
    return data;
  });
