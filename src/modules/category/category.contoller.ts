import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { SendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { categoryService } from "./category.service";

const createCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;

    const result = await categoryService.createCategoryDB(payload);

    SendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Category created successfully!",
      data: result,
    });
  
})

const getAllCategories = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
       const result = await categoryService.getAllCategoriesDB();

        SendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: "All categories fetched successfully!",
          data: result,
        });
})

const updateCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const {id}  = req.params;
    const payload = req.body;

   const result = await categoryService.updateCategoryDB(id as string, payload);

    SendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Category updated successfully!",
      data: result,
    });
  }
);

const deleteCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

   await categoryService.deleteCategoryDB(id as string);

    SendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Category deleted successfully!",
      data: null,
    });
  }
);

export const categoryController = {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
};