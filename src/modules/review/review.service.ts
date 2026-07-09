import { prisma } from "../../lib/prisma";
import { ICreateReview } from "./review.interface";

const createReviewDB = async (
  tenantId: string,
  payload: ICreateReview
) => {
  // Tenant must have completed a rental for this property
  const rental = await prisma.rentalRequest.findFirst({
    where: {
      tenantId,
      propertyId: payload.propertyId,
      status: "COMPLETED",
    },
  });

  if (!rental) {
    throw new Error("You can only review a property after completing the Payment.");
  }

  // Prevent duplicate review
  const reviewExists = await prisma.review.findFirst({
    where: {
      tenantId,
      propertyId: payload.propertyId,
    },
  });

  if (reviewExists) {
    throw new Error("You have already reviewed this property.");
  }

  const review = await prisma.review.create({
    data: {
      rating: payload.rating,
      comment: payload.comment,
      tenantId,
      propertyId: payload.propertyId,
    },
  });

  return review;
};

export const reviewService = {
  createReviewDB,
};