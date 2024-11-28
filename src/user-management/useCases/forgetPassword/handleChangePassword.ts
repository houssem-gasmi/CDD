import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { ResponseResult } from "../../../types/types.js";
import { CddUser } from "../../../models/CddUser.js";
import { ResetPasswordToken } from "../../../models/resetPasswordTokenSchema.js";

export const handleForgetPasswordController = async (req: Request, res: Response<ResponseResult<null>>) => {
  const token = req.query.token;
  const { password, confirmPassword } = req.body;

  if (!token) {
    return res.status(400).json({
      success: false,
      message: "invalid reset password token",
      status: 400,
    });
  }

  const resetPasswordToken = await ResetPasswordToken.findOne({
    token,
  });

  if (!resetPasswordToken) {
    return {
      success: false,
      message: "Invalid reset password token",
      status: 404,
    };
  }

  if (!password || !confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "password and confirm password are required",
      status: 400,
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "password and confirm password are not matching",
      status: 400,
    });
  }

  if (password.length < 6 || confirmPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message: "password length should be greater than 6",
      status: 400,
    });
  }

  try {
    const user = await CddUser.findOne({
      email: resetPasswordToken.email,
    });

    if (!user || user.isArchived || !user.isEnabled) {
      return res.status(404).json({
        success: false,
        message: "there is no user associated with such email",
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
    return {
      success: false,
      message: "error occured while handling the request, please try again later",
      status: 404,
    };
  }
};
