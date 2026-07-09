import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { prisma } from "../lib/prisma";
import { jwtUtils } from "../utils/jwt";
import { catchAsync } from "../utils/catchAsync";
import { Role } from "../../generated/prisma/client";


declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
        role: Role;
      };
    }
  }
}

export const auth = (...requiredRoles: Role[]) => {
  return catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      // Get Token
      const token = req.cookies.accessToken
        ? req.cookies.accessToken
        : req.headers.authorization?.startsWith("Bearer")
        ? req.headers.authorization.split(" ")[1]
        : req.headers.authorization;

      if (!token) {
        throw new Error("You are not logged in. Please login first!");
      }

      // Verify Token
      const verifiedToken = jwtUtils.verifyToken(
        token,
        config.jwt_access_secret
      );

      if (!verifiedToken.success) {
        throw new Error(verifiedToken.error);
      }

      const { id, name, email, role } = verifiedToken.data as JwtPayload;

      // Check User
      const user = await prisma.user.findUnique({
        where: {
          id,
        },
      });

      if (!user) {
        throw new Error("User not found!");
      }

      // Check User Status
      if (user.status === "INACTIVE") {
        throw new Error("Your account is disable. Please contact admin!");
      }

      // Check Role
      if (
        requiredRoles.length &&
        !requiredRoles.includes(user.role)
      ) {
        throw new Error("Unauthorized Access!");
      }

      req.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };

      next();
    }
  );
};