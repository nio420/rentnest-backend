import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { SendResponse } from "../../utils/sendResponse";
import { adminService } from "./admin.service";

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const searchTerm = req.query.searchTerm as string;

  const result = await adminService.getAllUsersDB(page, limit, searchTerm);

  SendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Users fetched successfully!",
    meta: result.meta,
    data: result.data,
  });
});

const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.id;
  const status = req.body.status;

  const result = await adminService.updateUserStatusDB(
    userId as string,
    status,
  );

  SendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "User status updated successfully!",
    data: result,
  });
});

const getAllProperties = catchAsync(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const result = await adminService.getAllPropertiesDB(page, limit);

  SendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Properties fetched successfully!",
    meta: result.meta,
    data: result.data,
  });
});

const getAllRentals = catchAsync(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const result = await adminService.getAllRentalsDB(page, limit);

  SendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Rental requests fetched successfully!",
    meta: result.meta,
    data: result.data,
  });
});

const getDashboardStats = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.getDashboardStatsDB();

  SendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Dashboard stats fetched successfully!",
    data: result,
  });
});

export const adminController = {
  getAllUsers,
  updateUserStatus,
  getAllProperties,
  getAllRentals,
  getDashboardStats,
};
