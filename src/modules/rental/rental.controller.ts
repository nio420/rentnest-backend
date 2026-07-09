import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { SendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { rentalService } from "./rental.service";

const createRental = catchAsync(async (req, res) => {
  const tenantId = req.user!.id;

  const result = await rentalService.createRentalDB(
    req.body,
    tenantId
  );

  SendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "Rental request submitted successfully!",
    data: result,
  });

});

const getMyRentals = catchAsync(async (req, res) => {
  const tenantId = req.user!.id;

  const result = await rentalService.getMyRentalsDB(tenantId);

  SendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Rental requests fetched successfully!",
    data: result,
  });

});

const getSingleRental = catchAsync(async (req, res) => {
  const tenantId = req.user!.id;
  const rentalId = req.params.id;

  const result = await rentalService.getSingleRentalDB(
    rentalId as string,
    tenantId
  );

  SendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Single Rental request fetched successfully!",
    data: result,
  });

});

const getLandlordRequests = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const landlordId = req.user!.id;
    const requests = await rentalService.getLandlordRequestsDB(landlordId);

    SendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Rental requests fetched successfully!",
      data: requests,
    });

  }
);

const updateRentalStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const landlordId = req.user!.id;

  const result = await rentalService.updateRentalStatusDB(
    id as string,
    landlordId,
    status
  );

  SendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Rental request updated successfully!",
    data: result,
  });
});

export const rentalController = {
  createRental,
  getMyRentals,
  getSingleRental,
  getLandlordRequests,
  updateRentalStatus,
};