import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../models/types';

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  success: boolean,
  data?: T,
  message?: string,
  error?: string
) => {
  const response: ApiResponse<T> = {
    success,
    timestamp: new Date().toISOString(),
    ...(data && { data }),
    ...(message && { message }),
    ...(error && { error }),
  };
  
  res.status(statusCode).json(response);
};

export const sendSuccess = <T>(
  res: Response,
  data?: T,
  message?: string,
  statusCode: number = 200
) => {
  sendResponse(res, statusCode, true, data, message);
};

export const sendError = (
  res: Response,
  error: string,
  statusCode: number = 500
) => {
  sendResponse(res, statusCode, false, undefined, undefined, error);
};