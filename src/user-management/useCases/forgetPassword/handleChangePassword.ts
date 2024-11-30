import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { ResponseResult } from "../../../types/types.js";
import { CddUser } from "../../../models/CddUser.js";
import { ResetPasswordToken } from "../../../models/resetPasswordTokenSchema.js";

export const handleForgetPasswordController = async (req: Request, res: Response<ResponseResult<null>>) => {
  const token = req.query.resetToken as string;
  const { password, confirmPassword } = req.body;

  if (!token) {
    return res.status(400).json({
      success: false,
      message: "Invalid reset password token",
      status: 400,
    });
  }

  const resetPasswordToken = await ResetPasswordToken.findOne({ token });

  if (!resetPasswordToken) {
    return res.status(404).json({
      success: false,
      message: "Invalid reset password token",
      status: 404,
    });
  }

  if (!password || !confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "Password and confirm password are required",
      status: 400,
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "Password and confirm password do not match",
      status: 400,
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password length should be greater than 6 characters",
      status: 400,
    });
  }

  try {
    const user = await CddUser.findOne({ email: resetPasswordToken.email });

    if (!user ) {
      return res.status(404).json({
        success: false,
        message: "There is no user associated with this email",
        status: 404,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password has been changed successfully",
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
