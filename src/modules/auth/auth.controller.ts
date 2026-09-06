import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { authService } from "./auth.service";
import { SendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import config from "../../config";


const registerUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const user = await authService.registerUserDB(payload);

    SendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "User created successfully",
      data: user,
    });
  },
);

const loginUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;

    const { accessToken, refreshToken } =
      await authService.loginUserDB(payload);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24, // 1 days or 24 hours
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days or 1 week
    });

    SendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "User logged in successfully!",
      data: {
        accessToken,
        refreshToken,
      },
    });
  },
);

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.refreshTokenDB(req);

  SendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Access token generated successfully!",
    data: result,
  });
});

const getMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const result = await authService.getMeDB(userId as string);

    SendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "User Data fetched successfully",
      data: result,
    });
  },
);

const googleCallback = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new Error("Google user information not found.");
    }

    const result = await authService.googleLoginDB(req.user);

    const redirectUrl = new URL(
      `${config.frontend_url}/auth/google-success`,
    );

    redirectUrl.searchParams.set("accessToken", result.accessToken);
    redirectUrl.searchParams.set("refreshToken", result.refreshToken);

    return res.redirect(redirectUrl.toString());
  },
);

export const authController = {
  registerUser,
  loginUser,
  getMe,
  refreshToken,
  googleCallback,
};
