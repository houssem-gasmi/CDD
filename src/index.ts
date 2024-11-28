import "dotenv/config";
import path from "path";
import morgan from "morgan";
import helmet from "helmet";
import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import { logger } from "./config/loggerSetup.js";

import { seedFakeUsers } from "./services/testUsers.js";
import { corsConfigFactory } from "./config/corsConfig.js";

import { connectToDatabase } from "./config/databaseSetup.js";
import { GlobalErrorHandler } from "./middlewares/errorHandler.js";
import { rateLimiterFactory } from "./config/rateLimiterConfig.js";
import { initializeSuperAdmin } from "./services/initializeSuperAdmin.js";
import { userManagementRouter } from "./user-management/userManagementRouter.js";


const __dirname = dirname(fileURLToPath(import.meta.url)); // get the current directory name (esm compatible)

const app = express();

app.use(rateLimiterFactory());
app.use(corsConfigFactory());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (_, res) => res.send("Hello World!"));
app.use("/api/user", userManagementRouter);


app.use(GlobalErrorHandler);

// bootstrap and start the server
const bootstrapServer = async () => {
  await connectToDatabase();
  await initializeSuperAdmin();

  await seedFakeUsers();
  

  app.listen(process.env.PORT, () => {
    logger.info(`Server is running on port ${process.env.PORT}`);
  });
};

bootstrapServer();
