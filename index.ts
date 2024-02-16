import express from "express";
import { ngoRouter } from "./routes/ngoRoute";
import { userRouter } from "./routes/userRoute";

const PORT = process.env.PORT || 8002;

const startServer = async () => {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use("/ngo", ngoRouter);
  app.use("/user", userRouter);
  app.use("/test", (req, res) => {
    res.json("Hello");
  });
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
