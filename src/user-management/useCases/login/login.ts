import jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import { Request, Response } from "express";
import { LoginResponseDto } from "./loginResponseDto.js";
import { ResponseResult, Role } from "../../../types/types.js";
import { CddUser } from "../../../models/CddUser.js";

const generateToken = (userId: string, role: Role, email: string) => {
  return jwt.sign(
    {
      id: userId,
      role,
      email,
    },
    process.env.JWT_SECRET as string,
    { expiresIn: "1d" }
  );
};

export const loginUserController = async (req: Request, res: Response<ResponseResult<LoginResponseDto>>) => {
  try {
    const { email, password } = req.body;

    // Validate request body fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide email and password",
        status: 400,
        success: false,
      });
    }

    // Check if user exists
    const user = await CddUser.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
        status: 400,
        success: false,
      });
    }

    if (!user.isEnabled)
      return res.status(304).json({
        success: false,
        status: 304,
        message: "Your account is currently disabled",
      });

    // User exists, check if password is correct
    const passwordIsCorrect = await bcrypt.compare(password, user.password);

    if (!passwordIsCorrect) {
      return res.status(400).json({
        message: "Invalid email or password",
        status: 400,
        success: false,
      });
    }
    // Generate Token
    const token = generateToken(user._id.toString(), user.role, user.email);

    // Send HTTP-only cookie
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400), // 1 day
      sameSite: "none",
      secure: true,
    });

    // Return user data and token
    const { firstName, lastName, phoneNumber } = user;
    return res.status(200).json({
      message: "User logged in successfully",
      status: 200,
      success: true,
      data: {
        firstName,
        lastName,
        email,
        phoneNumber,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: "Error during login, please try again later",
      status: 500,
      success: false,
    });
  }
};
