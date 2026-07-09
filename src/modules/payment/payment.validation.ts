import { z } from "zod";

const createPaymentValidationSchema = z.object({
  body: z.object({
    rentalId: z.string(),
  }),
});

export const paymentValidation = {
  createPaymentValidationSchema,
};