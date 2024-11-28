import * as bcrypt from "bcrypt";

import { CddUser } from "../models/CddUser.js";
import { logger } from "../config/loggerSetup.js";

export const initializeSuperAdmin = async () => {
  logger.info("Initializing SuperAdmin...");
  try {
    // Check if SuperAdmin already exists
    const superAdminExists = await CddUser.exists({ role: "SuperAdmin" });

    if (!superAdminExists) {
      // Create SuperAdmin
      await CddUser.create({
        firstName: process.env.SUPERADMIN_FIRSTNAME,
        lastName: process.env.SUPERADMIN_LASTNAME,
        email: process.env.SUPERADMIN_EMAIL,
        password: await bcrypt.hash(process.env.SUPERADMIN_PASSWORD as string, 10),
        role: "SuperAdmin",
        isActive: true,
      });

      logger.info("SuperAdmin created successfully.");
    } else {
      logger.warn("Skip creating SuperAdmin, already exists.");
    }
  } catch (error) {
    logger.fatal("Error initializing SuperAdmin:", error);
  }
};
