import { Router } from "express";
import { authController } from "./auth.controller";
import { authValidation } from "./auth.validation";
import { validateRequest } from "../../middleware/validateRequest";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import passport from "./google.strategy";
import config from "../../config";

const router = Router();

router.post(
  "/register",
  validateRequest(authValidation.registerValidationSchema),
  authController.registerUser,
);
router.post(
  "/login",
  validateRequest(authValidation.loginValidationSchema),
  authController.loginUser,
);
router.post("/refresh-token", authController.refreshToken);
router.get(
  "/me",
  auth(Role.TENANT, Role.LANDLORD, Role.ADMIN),
  authController.getMe,
);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "consent select_account",
  }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${config.frontend_url}/login`,
  }),
  authController.googleCallback,
);

export const authRouter = router;
