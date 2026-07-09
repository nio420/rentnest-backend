import { z } from "zod";

const createReviewValidationSchema = z.object({
  body: z.object({
    propertyId: z.string({
      error: "Property id is required",
    }),

    rating: z
      .number({
        error: "Rating is required",
      })
      .min(1)
      .max(5),

    comment: z.string({
      error: "Comment is required",
    }),
  }),
});

export const reviewValidation = {
  createReviewValidationSchema,
};