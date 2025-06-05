import express from "express"
import { authenticateToken } from "../middleware/auth.js";
import { sendEmail } from "../controllers/emails.js";

const router = express.Router();
router.post("/send_email", authenticateToken, sendEmail);
export default router;