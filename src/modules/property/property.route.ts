import { Router } from "express";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middleware/validateRequest";
import { propertyController } from "./property.controller";
import { propertyValidation } from "./property.validation";

const router = Router();
router.get("/properties", propertyController.getAllProperties);
router.get("/properties/:id", propertyController.getSingleProperty);

router.post("/landlord/properties", auth(Role.LANDLORD), validateRequest(propertyValidation.createPropertyValidationSchema), propertyController.createProperty)
router.put("/landlord/properties/:id", auth(Role.LANDLORD), validateRequest(propertyValidation.updatePropertyValidationSchema), propertyController.updateProperty)
router.delete("/landlord/properties/:id", auth(Role.LANDLORD), propertyController.deleteProperty)

export const propertyRouter = router;