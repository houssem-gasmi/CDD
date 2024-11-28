import { Request, Response } from "express";
import { ResponseResult } from "../../../types/types.js";
import { ResetPasswordToken } from "../../../models/resetPasswordTokenSchema.js";

export const verifyForgetPasswordLinkController = async (req: Request, res: Response<ResponseResult<null>>) => {
  const token = req.body.token;
  if (!token) {
    return res.status(400).json({
      success: false,
      message: "invalid reset password token",
      status: 400,
    });
  }

  try {
    const resetPasswordToken = await ResetPasswordToken.findOne({
      token,
    });

    if (!resetPasswordToken) {
      return res.status(404).json({
        success: false,
        message: "Invalid reset password token",
        status: 404,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Reset password token is valid",
      status: 200,
      data: null,
    });
  } catch (e) {
    return {
      success: false,
      message: "error occured while handling the request, please try again later",
      status: 404,
    };
  }
};
