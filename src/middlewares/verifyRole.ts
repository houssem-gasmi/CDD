import { NextFunction, Request, Response } from "express";
import { ResponseResult, Role } from "../types/types.js";

export const verifyRole = (allowedRoles: Role[]) => {
  return async (req: Request, res: Response<ResponseResult<null>>, next: NextFunction) => {
    const user = req.user;

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({
        success: false,
        status: 300,
        message: "you don't have enough permission to perform this action.",
      });
    }
    next();
  };
};
