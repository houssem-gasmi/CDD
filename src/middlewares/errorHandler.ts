import { ResponseResult } from "../types/types.js";
import { logger } from "../config/loggerSetup.js";
import { NextFunction, Request, Response } from "express";

// Global error handler
export const GlobalErrorHandler = (err: any, req: Request, res: Response<ResponseResult<null>>, next: NextFunction) => {
  logger.fatal("An error occurred because of an unhandled exception: ", err);
  res.status(500).json({
    success: false,
    status: 500,
    message: "An error occurred while processing your request. Please try again later.",
  });
};
