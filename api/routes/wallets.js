import express from "express";
import {
  getUserWallets,
  createWallet,
  addAsset,
} from "../controllers/wallets.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authenticateToken, getUserWallets);
router.post("/", authenticateToken, createWallet);
router.post("/:walletId/assets", authenticateToken, addAsset);

export default router;
