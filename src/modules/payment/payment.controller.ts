import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { SendResponse } from "../../utils/sendResponse";
import { paymentService } from "./payment.service";

const createPaymentSession = catchAsync(async (req: Request, res: Response) => {
  const tenantId = req.user!.id;
  const rentalId = req.body?.rentalId;

  const result = await paymentService.createPaymentSessionDB(
    rentalId,
    tenantId
  );

  SendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Stripe checkout session created successfully!",
    data: result,
  });

});


const confirmPayment = async (req: Request, res: Response) => {
  console.log("Incoming Webhook Connection Detected...");

  try {
    const signature = req.headers["stripe-signature"] as string;
    if (!signature) {
      return res.status(400).json({ error: "Missing stripe-signature header" });
    }

    const result = await paymentService.confirmPaymentDB(req.body, signature);
    return res.status(StatusCodes.OK).json(result);
  } catch (error: any) {
    console.error("Webhook safe-catch triggered:", error.message || error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

const getMyPayments = catchAsync(async (req, res) => {
  const tenantId = req.user!.id;

  const result = await paymentService.getMyPaymentsDB(tenantId);

  SendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Payments fetched successfully!",
    data: result,
  });

});

const getSinglePayment = catchAsync(async (req, res) => {
  const tenantId = req.user!.id;
  const paymentId = req.params.id;

  const result = await paymentService.getSinglePaymentDB(
    paymentId as string,   
    tenantId
  );

  SendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Payment fetched successfully!",
    data: result,
  });

});


export const paymentController = {
  createPaymentSession,
  confirmPayment,
  getMyPayments,
  getSinglePayment,
};