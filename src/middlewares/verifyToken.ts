import { NextFunction, Request, Response } from "express";
import { JwtAuthPayload } from "../types/types.js";
import jwt from "jsonwebtoken";
import { ResponseResult } from "../types/types.js";

export const verifyToken = (req: Request, res: Response<ResponseResult<null>>, next: NextFunction) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "you are not authenticated. Please login to continue.",
      status: 401,
      success: false,
    });
  }

  let user;
  try {
    user = jwt.verify(token, process.env.JWT_SECRET as string) as JwtAuthPayload;
  } catch {
    return res.status(401).json({
      message: "you are not authenticated. Please login to continue.",
      status: 401,
      success: false,
    });
  }

  if (!user) {
    return res.status(401).json({
      message: "you are not authenticated. Please login to continue.",
      status: 401,
      success: false,
    });
  }

  req.user = user;
  next();
};
