import express from "express";
import { verifyRole } from "../middlewares/verifyRole.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { loginUserController } from "./useCases/login/login.js";
import { changePasswordController } from "./useCases/changePassword/changePassword.js";


import { handleForgetPasswordController } from "./useCases/forgetPassword/handleChangePassword.js";
import { handleAccountStatusController } from "./useCases/handleAccountStatus/handleAccountStatus.js";
import { verifyForgetPasswordLinkController } from "./useCases/forgetPassword/verifyForgetPasswordLink.js";
import { generateForgetPasswordLinkController } from "./useCases/forgetPassword/generateForgetPasswordLink.js";
import { registerCddUserController } from "./useCases/registerCddUser/registerCddUser.js";

export const userManagementRouter = express.Router();

userManagementRouter.post("/register", registerCddUserController);
userManagementRouter.post("/login", loginUserController);
userManagementRouter.put("/change-password", verifyToken, changePasswordController);

userManagementRouter.post("/forget-password/getLink", generateForgetPasswordLinkController);
userManagementRouter.get("/reset-password", verifyForgetPasswordLinkController);

// Handle the form submission to reset password
userManagementRouter.post("/reset-password", handleForgetPasswordController);



userManagementRouter.put(
  "/handle-Account-Status",
  verifyToken,
  verifyRole(["DigitalTeam", "SuperAdmin"]),
  handleAccountStatusController
);
