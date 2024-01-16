import express from "express";
import { authRouter } from "./routes/authRoute";

const PORT = process.env.PORT || 8002;

const startServer = async () => {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use("/api", authRouter);
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
