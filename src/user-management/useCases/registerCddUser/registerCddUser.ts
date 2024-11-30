import * as bcrypt from "bcrypt";
import { Request, Response } from "express";
import { ResponseResult, ResponseWithToken } from "../../../types/types.js";
import { CddUser } from "../../../models/CddUser.js";
import { sendMail } from "../../../services/mailingService.js";
import { logger } from "../../../config/loggerSetup.js";
import validator from "validator";
import jwt from "jsonwebtoken";  // Import jsonwebtoken to create a token

export const registerCddUserController = async (
  req: Request,
  res: Response<ResponseResult<ResponseWithToken>> 
) => {
  try {
    const { firstName, lastName, email, password, phoneNumber, country } = req.body;

    // Validate request
    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide email and password",
        status: 400,
        success: false,
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        message: "Invalid email format",
        status: 400,
        success: false,
      });
    }

    // Check if user exists
    const userExists = await CddUser.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        message: "User with this email already exists",
        status: 400,
        success: false,
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user (default role is "Customer")
    const newUser = await CddUser.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: "Customer", // Default role as "Customer"
      phoneNumber,
      country,
      isEnabled: true,
    });

    // Log the new user creation
    logger.info(`New user created: ${JSON.stringify(newUser)}`);

    // Send welcome email
    try {
      await sendMail("Welcome to CDD", "Welcome to Customer Driven Domain", newUser.email);
      logger.info("Welcome mail sent successfully");
    } catch (emailError) {
      logger.error("Failed to send welcome email", emailError);
    }

    // Create JWT token
    const token = jwt.sign(
      {
        id: newUser._id,
        email: newUser.email,
        role: newUser.role,
      },
      process.env.JWT_SECRET as string, 
      { expiresIn: "1d" } 
    );
    logger.info("JWT Token generated: " + token);

    // Return user data with token
    res.status(200).json({
      message: "User registered successfully",
      status: 200,
      success: true,
      data: {
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        phoneNumber: newUser.phoneNumber,
        role: newUser.role,
        isEnabled: newUser.isEnabled,
        country: newUser.country,
        token, // Send the generated token back to the user
      },
    });
  } catch (error: unknown) {
    // Check if the error is an instance of Error
    if (error instanceof Error) {
      logger.error("Error during registration:", error.message, { error });
    } else {
      logger.error("Unknown error during registration", { error });
    }

    // Respond with a generic error message
    res.status(500).json({
      message: "An error occurred while processing your request. Please try again later.",
      status: 500,
      success: false,
    });
  }
};
