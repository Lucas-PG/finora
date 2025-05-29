import express from "express"
import { postMessage, getUserMessages } from "../controllers/messages.js"
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();
router.post("/messages/user", authenticateToken, getUserMessages)
router.post("/messages", authenticateToken, postMessage);
export default router;