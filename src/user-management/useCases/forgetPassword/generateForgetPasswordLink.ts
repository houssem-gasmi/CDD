import crypto from "crypto";
import { Request, Response } from "express";
import { ResponseResult } from "../../../types/types.js";
import { CddUser } from "../../../models/CddUser.js";
import { ResetPasswordToken } from "../../../models/resetPasswordTokenSchema.js";
import { sendMail } from "../../../services/mailingService.js";
import { logger } from "../../../config/loggerSetup.js";

export const generateForgetPasswordLinkController = async (req: Request, res: Response<ResponseResult<null>>) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
      status: 400,
    });
  }

  try {
    const user = await CddUser.findOne({ email });
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
      // Send email notification
      await sendMail("reset password link", `http://localhost:5000/reset-password?resetToken=${token}`, user.email);
      logger.info("Reset password link sent successfully");
    } catch (e) {
      logger.warn("Error sending email notification", e);
      return res.status(500).json({
        success: false,
        message: "Error occurred while sending the email, please try again later",
        status: 500,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Reset password link sent successfully. Please check your email.",
      status: 200,
      data: null,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "Error occurred while handling the request. Please try again later.",
      status: 500,
    });
  }
};
