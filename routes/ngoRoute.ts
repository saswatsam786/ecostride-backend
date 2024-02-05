import { NGOController } from "../controllers";
import express from "express";

const router = express.Router();

router.post("/signup", NGOController.signUp);

export { router as ngoRouter };
