import express from "express";
import { UserController } from "../controllers/userController";

const router = express.Router();

router.post("/signup", UserController.signUp);
router.get("/:id", UserController.getUserData);

export { router as userRouter };
