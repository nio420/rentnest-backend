import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { SendResponse } from "../../utils/sendResponse";
import { propertyService } from "./property.service";

const createProperty = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const landlordId = req.user?.id;
    const payload = req.body;

    const result = await propertyService.createPropertyDB(
      payload,
      landlordId as string
    );

    SendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Property created successfully!",
      data: result,
    });
  }
);

const updateProperty = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const landlordId = req.user?.id;
    const payload = req.body;

    const result = await propertyService.updatePropertyDB(
      id as string,
      payload,
      landlordId as string
    );

    SendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Property updated successfully!",
      data: result,
    });
  }
);

const deleteProperty = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const landlordId = req.user?.id;

    await propertyService.deletePropertyDB(
      id as string,
      landlordId as string
    );

    SendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Property deleted successfully!",
      data: null,
    });
  }
);

const getAllProperties = catchAsync(async (req, res) => {
    const query = req.query;
    const result = await propertyService.getAllPropertiesDB(query);

    SendResponse(res,{
        success:true,
        statusCode:StatusCodes.OK,
        message:"Properties fetched successfully!",
        meta: result.meta,
        data: result.data
    })

})

const getSingleProperty = catchAsync(async(req,res)=>{

    const {id} = req.params;

    const result = await propertyService.getSinglePropertyDB(id as string);

    SendResponse(res,{
        success:true,
        statusCode:StatusCodes.OK,
        message:"Property fetched successfully!",
        data: result
    })

})

export const propertyController = {
  createProperty,
  updateProperty,
  deleteProperty,
  getAllProperties,
  getSingleProperty
};