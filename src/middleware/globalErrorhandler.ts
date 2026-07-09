import { StatusCodes } from "http-status-codes"
import { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client";

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {

    let statusCode = StatusCodes.INTERNAL_SERVER_ERROR
    let errorName = err.name || "Internal Server Error"
    let errorMessage = err.message || "Internal Server Error"
    let errorDeatils = err.stack

    if(err instanceof Prisma.PrismaClientValidationError){
        statusCode = StatusCodes.BAD_REQUEST
        errorMessage = "You have provided invalid data for the request. Please check your request and try again."
    } else if(err instanceof Prisma.PrismaClientKnownRequestError){
        if(err.code === "P2002"){
            statusCode = StatusCodes.BAD_REQUEST
            errorMessage = "A resource with the same identifier already exists."
        } else if(err.code === "P2003"){
            statusCode = StatusCodes.BAD_REQUEST
            errorMessage = "A foreign key constraint failed. Please check your request and try again."
        } else if(err.code === "P2025"){
            statusCode = StatusCodes.BAD_REQUEST
            errorMessage = " An operation failed because it depends on one or more records that were required but not found. Please check your request and try again."
        }
    } else if(err instanceof Prisma.PrismaClientInitializationError){
        if(err.errorCode === "P1000"){
            statusCode = StatusCodes.UNAUTHORIZED
            errorMessage = "Authentication failed. Please check your credentials and try again."
        } else if(err.errorCode === "P1001"){  
            statusCode = StatusCodes.BAD_REQUEST
            errorMessage = "You Can't reach the database Server."
        }
    } else if(err instanceof Prisma.PrismaClientUnknownRequestError){
        statusCode = StatusCodes.INTERNAL_SERVER_ERROR
        errorMessage = "Erro Occured while performing the request. Please try again later."
    }

    res.status(statusCode).json({
    success: false,
    statusCode: statusCode,
    name: errorName,
    message: errorMessage,
    error: errorDeatils,
  });
}