import * as bcrypt from "bcrypt";
import { Request, Response } from "express";
import { ResponseResult } from "../../../types/types.js";
import { changePasswordSchema } from "./changePasswordSchema.js";
import { CddUser } from "../../../models/CddUser.js";

export const changePasswordController = async (req: Request, res: Response<ResponseResult<null>>) => {
  const validation = changePasswordSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      message: validation.error.errors[0].message,
      success: false,
      status: 400,
    });
  }

  try {
    const user = await CddUser.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "Requested user does not exist in the system, please try again later",
        success: false,
        status: 404,
      });
    }

    const isPasswordMatch = await bcrypt.compare(req.body.oldPassword, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Your old password is incorrect",
        success: false,
        status: 400,
      });
    }

    const isNewPasswordDifferent = await bcrypt.compare(req.body.password, user.password);

    if (isNewPasswordDifferent) {
      return res.status(400).json({
        message: "Your new password must be different from your old password",
        success: false,
        status: 400,
      });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      message: "Your password has been changed successfully",
      success: true,
      status: 200,
      data: null,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error occurred while handling the request, please try again later",
      success: false,
      status: 500,
    });
  }
};

