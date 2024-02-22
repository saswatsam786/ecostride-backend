import express from "express";
import { UserController } from "../controllers/userController";

const router = express.Router();

router.post("/signup", UserController.signUp);
router.get("/campaigns", UserController.getAllCampaigns);
router.get("/:email", UserController.getUserData);
router.get("/campaigns/:campaignId", UserController.getCampaign);
router.post("/transaction/:campaignId", UserController.transactionCampaign);

export { router as userRouter };
