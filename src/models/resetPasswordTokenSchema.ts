import mongoose from "mongoose";

/** LinkSchema is used to store the details of the links */
const ResetPasswordTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },

  email: {
    type: String,
    required: true,
  },
});

export const ResetPasswordToken = mongoose.model("Link", ResetPasswordTokenSchema);
