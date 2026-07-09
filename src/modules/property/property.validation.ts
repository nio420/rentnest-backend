import { z } from "zod";

const createPropertyValidationSchema = z.object({
  body: z.object({
    title: z.string().min(2, "Title is required"),

    description: z.string().min(5, "Description is required"),

    location: z.string().min(2, "Location is required"),

    address: z.string().optional(),

    rentPrice: z.number().positive(),

    bedrooms: z.number().int().positive(),

    bathrooms: z.number().int().positive(),

    amenities: z.array(z.string()),

    image: z.string().optional(),

    categoryId: z.string(),
  }),
});

const updatePropertyValidationSchema = z.object({
  body: z.object({
    title: z.string().optional(),

    description: z.string().optional(),

    location: z.string().optional(),

    address: z.string().optional(),

    rentPrice: z.number().positive().optional(),

    bedrooms: z.number().int().positive().optional(),

    bathrooms: z.number().int().positive().optional(),

    amenities: z.array(z.string()).optional(),

    image: z.string().optional(),

    categoryId: z.string().optional(),
  }),
});

export const propertyValidation = {
  createPropertyValidationSchema,
  updatePropertyValidationSchema,
};