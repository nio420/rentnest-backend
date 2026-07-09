import { NextFunction, Request, RequestHandler, Response } from "express";

export const catchAsync = (fn: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error: any) {

      
      next(error);
    }
  }
}

  // res.status(500).json({
  //   success: false,
  //   statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
  //   message: error.message,
  //   data: null,
  // });