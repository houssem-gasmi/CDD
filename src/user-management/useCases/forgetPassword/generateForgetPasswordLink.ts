import crypto from "crypto";
import { Request, Response } from "express";
import { ResponseResult } from "../../../types/types.js";
import { CddUser } from "../../../models/CddUser.js";
import { ResetPasswordToken } from "../../../models/resetPasswordTokenSchema.js";
import { sendMail } from "../../../services/mailingService.js";
import { logger } from "../../../config/loggerSetup.js";

export const generateForgetPasswordLinkController = async (req: Request, res: Response<ResponseResult<null>>) => {
  if (!req.body.email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
      status: 400,
    });
  }

  try {
    const user = await CddUser.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        status: 404,
      });
    }

    const token = crypto.randomBytes(10).toString("hex");

    await ResetPasswordToken.create({
      token,
      email: user.email,
    });

    try {
      // send email notification
      await sendMail("reset password link", "http://localhost:3000/reset-password?resetToken=" + token, user.email);
      logger.info("Reset password link sent successfully");
    } catch (e) {
      logger.warn("Error sending email notification", e);
      return {
        success: false,
        message: "error occured while sending the email, please try again later",
        status: 404,
      };
    }

    return res.status(200).json({
      success: true,
      message: "Reset password link sent successfully , please check your email",
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
