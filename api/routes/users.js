import express from "express"
import { login, verifyToken, postUser, getUserInfo, updateUserPassword } from "../controllers/users.js"
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();
router.post("/login", login);
router.post("/register", postUser);
router.get("/info", authenticateToken, getUserInfo)
router.post("/verify", authenticateToken, verifyToken)
router.post("/updatePassword", authenticateToken, updateUserPassword)
export default router;