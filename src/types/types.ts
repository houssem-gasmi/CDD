// src/types/types.ts

import { CddUserType } from "../models/CddUser.js"; // Make sure this import path is correct

// Existing types
export type Role = "SuperAdmin" | "DigitalTeam" | "Customer";

export type JwtAuthPayload = {
  id: string;
  email: string;
  role: Role;
};

type SuccessResponse<T> = {
  data: T;
  message: string;
  status: number;
  success: true;
};

type ErrorResponse = {
  message: string;
  status: number;
  success: false;
};

/** this generic type is used to define the response of an api call
 * it takes a generic type T which is the type of the data returned by the api
 */
export type ResponseResult<T> = SuccessResponse<T> | ErrorResponse;

// New type for response with token

// Define a custom type that includes the token
export type ResponseWithToken = Omit<CddUserType, "password"> & { token: string };

