import mongoose from "mongoose";

/** LinkSchema is used to store the details of the links */
const RegisterTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } // Enable timestamps to automatically add `createdAt` and `updatedAt`
);

export const RegisterToken = mongoose.model("Register-link", RegisterTokenSchema);
