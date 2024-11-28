import { Request, Response } from "express";
import { ResponseResult } from "../../../types/types.js";
import { CddUser, CddUserType } from "../../../models/CddUser.js";

export const handleAccountStatusController = async (
  req: Request,
  res: Response<ResponseResult<Omit<CddUserType, "password">>>
) => {
  const currentUser = req.user;
  const { otherUserId } = req.body;

  try {
    // Check if the current user exists
    const foundCurrentUser = await CddUser.findOne({ _id: currentUser.id });
    if (!foundCurrentUser) {
      return res.status(404).json({
        message: "Current user does not exist.",
        status: 404,
        success: false,
      });
    }


    // Find the user to be disabled
    const otherUser = await CddUser.findById(otherUserId);
    if (!otherUser) {
      return res.status(404).json({
        message: "User to be disabled not found.",
        status: 404,
        success: false,
      });
    }

    // Update the user's account status to disabled
    const updatedUser = await CddUser.findOneAndUpdate(
      { _id: otherUserId },
      { isEnabled: !otherUser.isEnabled }, // Toggle the isEnabled field
      { new: true }
    );

    if (!updatedUser) { 
      return res.status(404).json({
        message: "User not found.",
        status: 404,
        success: false,
      });
    }

    // Respond with the updated user's data
    res.status(200).json({
      message: "User's account status updated successfully.",
      status: 200,
      success: true,
      data: {
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        phoneNumber: updatedUser.phoneNumber,
        country: updatedUser.country,
        role: updatedUser.role,
        isEnabled: updatedUser.isEnabled,
        isArchived: updatedUser.isArchived,
      },
    });
  } catch (error) {
    console.error(error);
    // Respond with an error message if an error occurs
    return res.status(500).json({
      message: "Error occurred while updating the user's account status. Please try again later.",
      status: 500,
      success: false,
    });
  }
};
