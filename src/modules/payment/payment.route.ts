import { Router } from "express";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import { paymentController } from "./payment.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { paymentValidation } from "./payment.validation";

const router = Router();

// post
router.post("/create", auth(Role.TENANT), validateRequest(paymentValidation.createPaymentValidationSchema), paymentController.createPaymentSession);
// get
router.get("/", auth(Role.TENANT), paymentController.getMyPayments);
router.get("/:id", auth(Role.TENANT), paymentController.getSinglePayment);

export const paymentRouter = router;