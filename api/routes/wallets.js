import express from "express";
import {
  getUserWallets,
  createWallet,
  addAsset,
  deleteWallet,
  updateAsset,
  deleteAsset,
  getWalletHistoricalData,
  updateWalletName,
} from "../controllers/wallets.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authenticateToken, getUserWallets);
router.post("/", authenticateToken, createWallet);
router.delete("/:id", authenticateToken, deleteWallet);
router.post("/:walletId/assets", authenticateToken, addAsset);
router.put("/:walletId/assets/:assetId", authenticateToken, updateAsset);
router.delete("/:walletId/assets/:assetId", authenticateToken, deleteAsset);
router.get("/:walletId/historical", authenticateToken, getWalletHistoricalData);
router.put("/:id", authenticateToken, updateWalletName);

export default router;
