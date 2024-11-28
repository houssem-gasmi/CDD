import * as bcrypt from "bcrypt";
import { Request, Response } from "express";
import { ResponseResult, Role, ResponseWithToken } from "../../../types/types.js";
import { CddUser, CddUserType } from "../../../models/CddUser.js";
import { sendMail } from "../../../services/mailingService.js";
import { logger } from "../../../config/loggerSetup.js";
import { RegisterToken } from "../../../models/registerTokenSchema.js";
import validator from "validator";
import jwt from "jsonwebtoken";  // Import jsonwebtoken to create a token

export const registerCddUserController = async (
  req: Request,
  res: Response<ResponseResult<ResponseWithToken>> // Use the new ResponseWithToken type
) => {
  try {
    const { firstName, lastName, email, password, role, phoneNumber, country } = req.body;

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

    // Create new user
    const newUser = await CddUser.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      phoneNumber,
      country,
      isEnabled: true,
    });

    // Send welcome email
    await sendMail("Welcome to CDD", "Welcome to Customer Driven Domain", newUser.email);
    logger.info("Welcome mail sent successfully");

    // Create JWT token
    const token = jwt.sign(
      {
        id: newUser._id,
        email: newUser.email,
        role: newUser.role,
      },
      process.env.JWT_SECRET as string,  // Use your JWT secret key
      { expiresIn: "1h" }  // Set expiration time for the token (1 hour in this example)
    );

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
        isArchived: newUser.isArchived,
        country: newUser.country,
        token,  // Send the generated token back to the user
      },
    });
  } catch (error: unknown) { // Explicitly typing `error` as `unknown`
    if (error instanceof Error) {
      // Now TypeScript knows `error` is an instance of `Error`
      logger.error("Error during registration:", error.message, { error });
    } else {
      // Handle the case where the error is not of type `Error`
      logger.error("Unknown error during registration", { error });
    }
    res.status(500).json({
      message: "Error during registration, please try again later",
      status: 500,
      success: false,
    });
  }
};
