import { AuthController } from "../controllers";
import express from "express";

const router = express.Router();

router.post("/signup", AuthController.signUp);

export { router as authRouter };
