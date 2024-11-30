import express from "express";
import { verifyRole } from "../middlewares/verifyRole.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { loginUserController } from "./useCases/login/login.js";
import { changePasswordController } from "./useCases/changePassword/changePassword.js";
import { getLoggedInUserController } from "./useCases/getLoggedInUser/getLoggedInUser.js";

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
userManagementRouter.post("/forget-password/verifyLink", verifyForgetPasswordLinkController);
userManagementRouter.post("/forget-password/change-password", handleForgetPasswordController);

userManagementRouter.get("/user-profile", verifyToken, getLoggedInUserController);

userManagementRouter.put(
  "/handle-Account-Status",
  verifyToken,
  verifyRole(["DigitalTeam", "SuperAdmin"]),
  handleAccountStatusController
);
