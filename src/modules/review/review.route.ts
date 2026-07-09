import { Router } from "express";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middleware/validateRequest";
import { reviewValidation } from "./review.validation";
import { reviewController } from "./review.controller";


const router = Router();


router.post(
  "/",
  auth(Role.TENANT),
  validateRequest(
    reviewValidation.createReviewValidationSchema
  ),
  reviewController.createReview
);


export const reviewRouter = router;