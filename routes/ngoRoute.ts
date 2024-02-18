import { NGOController } from "../controllers";
import express from "express";

const router = express.Router();

router.post("/signup", NGOController.signUp);
router.get("/signup", NGOController.getNgoData);
router.post("/user", NGOController.getNgoData);
router.post("/campaign/create", NGOController.campaignCreate);

export { router as ngoRouter };
