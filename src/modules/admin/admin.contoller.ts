import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { SendResponse } from "../../utils/sendResponse";
import { adminService } from "./admin.service";

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.getAllUsersDB();

  SendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Users fetched successfully!",
    data: result,
  });
});

const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
    const userId = req.params.id;
    const status = req.body.status;

  const result = await adminService.updateUserStatusDB(
    userId as string,
    status
  );

  SendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "User status updated successfully!",
    data: result,
  });
});

const getAllProperties = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.getAllPropertiesDB();

  SendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Properties fetched successfully!",
    data: result,
  });
});

const getAllRentals = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.getAllRentalsDB();

  SendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Rental requests fetched successfully!",
    data: result,
  });
});

export const adminController = {
  getAllUsers,
  updateUserStatus,
  getAllProperties,
  getAllRentals,
};