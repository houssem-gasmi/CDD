import mongoose from "mongoose";
import { Role } from "../types/types.js";

export type CddUserType = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: Role;
  country: string;
  isEnabled: boolean;
};

const CddUserSchema = new mongoose.Schema<CddUserType>({
  firstName: {
    type: String,
    required: [true, "FirstName is required"],
  },
  lastName: {
    type: String,
    required: [true, "LastName is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
  },
  password: {
    type: String,
    //required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters long"],
  },
  role: {
    type: String,
    enum: ["SuperAdmin", "DigitalTeam", "Customer"],
    
  },
  country: {
    type: String,
  },
  isEnabled: {
    type: Boolean,
    default: true,
  },
 
});

export const CddUser = mongoose.model("CddUser", CddUserSchema);
