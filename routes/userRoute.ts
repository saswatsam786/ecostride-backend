import express from "express";
import { UserController } from "../controllers/userController";

const router = express.Router();

router.post("/signup", UserController.signUp);
router.get("/campaigns", UserController.getAllCampaigns);
router.get("/:id", UserController.getUserData);
router.get("/campaigns/:campaignId", UserController.getCampaign);

export { router as userRouter };
