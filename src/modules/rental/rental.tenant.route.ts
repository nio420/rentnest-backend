import { Router } from "express";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import { rentalController } from "./rental.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { rentalValidation } from "./rental.validation";

const router = Router();

// Tenant
router.get("/", auth(Role.TENANT), rentalController.getMyRentals)
router.get("/:id", auth(Role.TENANT), rentalController.getSingleRental)
router.post("/", auth(Role.TENANT), validateRequest(rentalValidation.createRentalValidationSchema), rentalController.createRental)


export const rentalTenantRouter = router;