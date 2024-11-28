import * as bcrypt from "bcrypt";
import { logger } from "../config/loggerSetup.js";
import { CddUser } from "../models/CddUser.js";

export const seedFakeUsers = async () => {
  logger.info("****************** seeding fake users ******************");
  try {
    // Check if each type already exists in the database

    // enum: ["SuperAdmin", "DigitalTeam", "User"],
    const existingSuperAdmin = await CddUser.findOne({ email: "superadmin@mail.com" });

    if (existingSuperAdmin) logger.warn("Super Admin already exists");
    else
      await CddUser.create({
        firstName: "Super",
        lastName: "Admin",
        email: "superadmin@mail.com",
        phoneNumber: "78451245",
        password: await bcrypt.hash("superadmin" as string, 10),
        role: "SuperAdmin",
        country: "Nigeria",
        isEnabled: true,
        isArchived: false,
      });
    logger.warn("username: superadmin@mail.com, password: superadmin , role: SuperAdmin");

    const existingDigitalTeam = await CddUser.findOne({ email: "DigitalTeam@mail.com" });
    if (existingDigitalTeam) logger.warn("DigitalTeam already exists");
    else
      await CddUser.create({
        firstName: "DigitalTeam",
        lastName: "DigitalTeam",
        email: "DigitalTeam@mail.com",
        phoneNumber: "78451245",
        password: await bcrypt.hash("DigitalTeam" as string, 10),
        role: "DigitalTeam",
        country: "Nigeria",
        isEnabled: true,
        isArchived: false,
      });
    logger.info("username: superadmin@mail.com, password: superadmin , role: DigitalTeam");

    const existingUser = await CddUser.findOne({ email: "Customer@mail.com" });
    if (existingUser) logger.info("User already exists");
    else
      await CddUser.create({
        firstName: "Customer",
        lastName: "Customer",
        email: "Customer@mail.com",
        phoneNumber: "78451245",
        password: await bcrypt.hash("Customer" as string, 10),
        role: "Customer",
        country: "Nigeria",
        isEnabled: true,
        isArchived: false,
      });
    logger.info("username: Customer@mail.com , password: Customer , role: Customer");
  } catch (error) {
    console.log(error);
    logger.fatal("Error creating test users:", error);
  }
};
