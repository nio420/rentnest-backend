import { Router } from "express";
import { authController } from "./auth.controller";
import { authValidation } from "./auth.validation";
import { validateRequest } from "../../middleware/validateRequest";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post("/register", validateRequest(authValidation.registerValidationSchema), authController.registerUser)
router.post("/login", validateRequest(authValidation.loginValidationSchema), authController.loginUser)
router.get("/me", auth(Role.TENANT, Role.LANDLORD, Role.ADMIN), authController.getMe)

export const authRouter = router;