import jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import { Request, Response } from "express";
import { ResponseResult, Role } from "../../../types/types.js"; // Make sure this import is correct
import { CddUser } from "../../../models/CddUser.js";

// Function to generate JWT token
const generateToken = (userId: string, role: Role, email: string): string => {
  try {
    console.log("Generating JWT for user:", userId, role, email); // Debugging info

    return jwt.sign(
      {
        id: userId,
        role,
        email,
      },
      process.env.JWT_SECRET as string, // Ensure this secret key is in .env file
      { expiresIn: "1d" } // Token expires in 1 day
    );
  } catch (error) {
    console.error("Error generating JWT:", error); // Log the error
    throw new Error("Error generating JWT");
  }
};

// Controller function for logging in a user
export const loginUserController = async (
  req: Request,
  res: Response<ResponseResult<any>> // Use 'any' if 'LoginResponseDto' is not defined or import it properly
) => {
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
      console.log("User not found for email:", email); // Debugging
      return res.status(400).json({
        message: "Invalid email or password",
        status: 400,
        success: false,
      });
    }

    // Check if account is enabled
    if (!user.isEnabled) {
      return res.status(304).json({
        success: false,
        status: 304,
        message: "Your account is currently disabled",
      });
    }

    // Check if password is correct
    const passwordIsCorrect = await bcrypt.compare(password, user.password);
    if (!passwordIsCorrect) {
      console.log("Incorrect password for user:", email); // Debugging
      return res.status(400).json({
        message: "Invalid email or password",
        status: 400,
        success: false,
      });
    }

    // Generate JWT token for the user
    const token = generateToken(user._id.toString(), user.role, user.email);
    console.log("Generated token:", token); // Debugging

    // Send JWT token as HTTP-only cookie
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400), // Token expires in 1 day
      sameSite: "none", // Required for cross-origin cookies
      secure: process.env.NODE_ENV === "production", // Set to true if using HTTPS in production
    });

    console.log("Token sent as cookie:", token); // Debugging

    // Return user data (without country field) along with the token
    const { firstName, lastName, phoneNumber, role } = user;
    return res.status(200).json({
      message: "User logged in successfully",
      status: 200,
      success: true,
      data: {
        firstName,
        lastName,
        email,
        phoneNumber,
        role,
      },
    });
  } catch (error) {
    console.error("Login error:", error); // Log the error
    return res.status(500).json({
      message: "Error during login, please try again later",
      status: 500,
      success: false,
    });
  }
};
