import { z } from "zod";
import { Role } from "../../../generated/prisma/client";

const registerValidationSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name is required"),

    email: z.email("Invalid email address"),

    password: z.string().min(5, "Password must be at least 5 characters"),

    profilePhoto: z.string().optional(),

    role: z.enum(Role).refine(
      (role) => role === Role.TENANT || role === Role.LANDLORD ||
      {
        message: "Role must be TENANT or LANDLORD",
      }
    ),
  }),
});

const loginValidationSchema = z.object({
  body: z.object({
    email: z.email("Invalid email address"),

    password: z.string().min(1, "Password is required"),
  }),
});

export const authValidation = {
  registerValidationSchema,
  loginValidationSchema,
};