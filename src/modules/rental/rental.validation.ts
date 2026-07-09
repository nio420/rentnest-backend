import { z } from "zod";


const createRentalValidationSchema = z.object({
  body: z.object({
    propertyId: z.string(),
    moveInDate: z.string(),
    rentalMonths: z.number().min(1),
  }),
});

const updateRentalStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum(["APPROVED", "REJECTED"]),
  }),
});

export const rentalValidation = {
  createRentalValidationSchema,
  updateRentalStatusValidationSchema
};