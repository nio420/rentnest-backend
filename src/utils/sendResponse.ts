import { Response } from "express";

export type TResponsData <T> = {
    success: boolean;
    statusCode: number;
    message: string;
    data: T;
    meta ?: TMeta
}
export type TMeta = {
    page: number;
    limit: number;
}

export const SendResponse = <T> (res: Response, data: TResponsData<T>) => {
  res.status(data.statusCode).json({
    success: data.success,
    statusCode: data.statusCode,
    message: data.message,
    data: data.data,
    meta: data.meta
  });
}