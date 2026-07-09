import { Router } from "express";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import { rentalController } from "./rental.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { rentalValidation } from "./rental.validation";

const router = Router();

// Landlord
router.get("/", auth(Role.LANDLORD), rentalController.getLandlordRequests)
router.patch("/:id", auth(Role.LANDLORD), validateRequest(rentalValidation.updateRentalStatusValidationSchema), rentalController.updateRentalStatus)



export const rentalLandlordRouter = router;