import { z } from "zod";

const createCategoryValidation = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, "Category name is required"),

    description: z
      .string()
      .optional(),
  }),
});

const updateCategoryValidation = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, "Category name is required")
      .optional(),

    description: z
      .string()
      .optional(),
  }),
});

export const categoryValidation = {
  createCategoryValidation,
  updateCategoryValidation,
};