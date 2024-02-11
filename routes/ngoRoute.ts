import { NGOController } from "../controllers";
import express from "express";

const router = express.Router();

router.post("/signup", NGOController.signUp);
router.post("/campaign/create", NGOController.campaignCreate);

export { router as ngoRouter };
