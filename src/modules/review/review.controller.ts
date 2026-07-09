import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { reviewService } from "./review.service";
import { SendResponse } from "../../utils/sendResponse";
import { catchAsync } from "../../utils/catchAsync";

const createReview = catchAsync(async (req: Request, res: Response) => {
  const tenantId = req.user!.id;
  const payload = req.body;

  const result = await reviewService.createReviewDB(
    tenantId,
    payload
  );

  SendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "Review created successfully!",
    data: result,
  });
});

export const reviewController = {
  createReview,
};