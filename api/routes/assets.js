import express from "express";
import { getAssets, getTickerInfo } from "../controllers/assets.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getAssets);
router.get("/:ticker", getTickerInfo);

export default router;
