import express from "express";
import { getAssets } from "../controllers/assets.js";

const router = express.Router();

router.get("/", getAssets);

export default router;
