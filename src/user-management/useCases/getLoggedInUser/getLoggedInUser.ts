import { Request, Response } from "express";
import { ResponseResult } from "../../../types/types.js";
import { CddUser, CddUserType } from "../../../models/CddUser.js";

export const getLoggedInUserController = async (
  req: Request,
  res: Response<ResponseResult<Omit<CddUserType, "password">>>
) => {
  try {
    const userId = req.user.id;
    console.log(userId);
    const userInfo = await CddUser.findOne({ _id: userId });

    if (!userInfo) {
      return res.status(404).json({
        message: "User not found",
        success: false,
        status: 404,
      });
    }

    if (userInfo.isArchived === true) {
      return res.status(401).json({
        message: "User is not Active!",
        success: false,
        status: 401,
      });
    }

    if (userInfo.isEnabled === false) {
      return res.status(401).json({
        message: "User is not Active",
        success: false,
        status: 401,
      });
    }
    res.status(200).json({
      message: "User found successfully",
      status: 200,
      success: true,
      data: {
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        email: userInfo.email,
        phoneNumber: userInfo.phoneNumber,
        role: userInfo.role,
        country: userInfo.country,
        isEnabled: userInfo.isEnabled,
        isArchived: userInfo.isArchived,
      },
    });
  } catch (e) {
    return {
      success: false,
      message: "error occured while handling the request, please try again later",
      status: 404,
    };
  }
};
