import cors from "cors";

export const corsConfigFactory = () => {
  const origins = ["http://localhost:3000", "http://localhost:3001"];
  return cors({
    origin: origins,
    credentials: true,
  });
};
