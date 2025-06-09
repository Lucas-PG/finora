import { db } from "../db.js";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import fetch from "node-fetch";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import fs from "fs";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
const CAPTCHA_SECRET = process.env.CAPTCHA_SECRET;

export const login = async (req, res) => {
  // const { email, password, captchaToken } = req.body;
  const { email, password } = req.body;
  if (!email?.trim() || !password?.trim()) {
    return res.status(401).send({ data: "Invalid Credentials." });
  }

  // const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${CAPTCHA_SECRET}&response=${captchaToken}`;
  // const captchaResponse = await fetch(verificationUrl, { method: "POST" });
  // const data = await captchaResponse.json();
  // if (!data.success) {
  //   return res
  //     .status(400)
  //     .send({ data: "Captcha Validation Failed. Try again." });
  // }

  try {
    const [rows] = await db.query(
      "SELECT uuid, password, name FROM users WHERE email=?",
      [email],
    );

    if (rows.length === 0) {
      return res.status(401).send({ data: "User not found" });
    }

    const user = rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).send({ data: "Invalid Credentials." });
    }

    const token = jwt.sign({ uuid: user.uuid }, JWT_SECRET, {
      expiresIn: "1h",
    });
    return res.status(200).json({ token, name: user.name });
  } catch (err) {
    return res.status(500).json({ error: "Database error" });
  }
};

export const verifyToken = (_, res) => {
  return res.status(200).json({ data: "Valid Token." });
};

export const postUser = async (req, res) => {
  // const { name, email, password, confirmPassword, captchaToken } = req.body;
  const { name, email, password, confirmPassword } = req.body;

  // if (!captchaToken) {
  //   return res.status(400).json({ data: "Invalid Captcha." });
  // }
  if (!name?.trim() || !email?.trim() || !password?.trim()) {
    return res.status(400).json({ data: "Invalid Parameters." });
  }
  if (password !== confirmPassword) {
    return res
      .status(400)
      .json({ data: "Password is not equal to Confirm Password" });
  }

  // const response = await fetch(
  //   "https://www.google.com/recaptcha/api/siteverify",
  //   {
  //     method: "POST",
  //     headers: { "Content-Type": "application/x-www-form-urlencoded" },
  //     body: `secret=${CAPTCHA_SECRET}&response=${captchaToken}`,
  //   },
  // );
  // const data = await response.json();
  //
  // if (!data.success) {
  //   return res
  //     .status(400)
  //     .json({ data: "Captcha Validation Failed. Try again." });
  // }

  try {
    const salt = 10;
    const hashPassword = await bcrypt.hash(password, salt);
    const uuid = uuidv4();

    await db.query(
      "INSERT INTO users (uuid, name, email, password) VALUES (?, ?, ?, ?)",
      [uuid, name, email, hashPassword],
    );

    return res.status(201).json({ name, email });
  } catch (err) {
    return res.status(500).json({
      data: "Error while registering user. Email already been registered.",
    });
  }
};

export const getUserInfo = async (req, res) => {
  const userId = req.user.userId;
  try {
    const [results] = await db.query(
      "SELECT name, email, photo FROM users WHERE uuid=?",
      [userId],
    );
    return res.status(200).json(results);
  } catch (err) {
    return res.status(500).send(err);
  }
};

export const updateUserPassword = async (req, res) => {
  const { password, confirmPassword } = req.body;

  if (!password?.trim() || !confirmPassword?.trim()) {
    return res.status(400).send({ data: "Invalid Parameters." });
  }
  if (password !== confirmPassword) {
    return res
      .status(400)
      .send({ data: "Password is not equal to Confirm Password" });
  }

  try {
    const hashPassword = await bcrypt.hash(password, 10);
    const userId = req.user.userId;
    await db.query("UPDATE users SET password=? WHERE uuid=?", [
      hashPassword,
      userId,
    ]);
    return res.status(200).json({ data: "Password updated." });
  } catch (err) {
    return res
      .status(500)
      .send("Error while updating password. Try again later.");
  }
};

export const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, callback) => {
      const directory = "./uploads";
      if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory);
      }
      callback(null, directory);
    },
    filename: (req, file, callback) => {
      const extname = path.extname(file.originalname);
      callback(null, `${req.user.userId}${extname}`);
    },
  }),
  fileFilter: function (req, file, callback) {
    const types = ["image/jpeg", "image/png", "image/jpg"];
    if (!types.includes(file.mimetype)) {
      return callback(
        new Error("Only .jpg, .jpeg, .png files are allowed."),
        false,
      );
    }
    callback(null, true);
  },
}).single("photo");

export const uploadUserPhoto = async (req, res) => {
  const userId = req.user.userId;
  const filename = req.file.filename;

  try {
    await db.query("UPDATE users SET photo=? WHERE uuid=?", [filename, userId]);
    return res.status(200).json({ data: "Photo uploaded.", filename });
  } catch (err) {
    return res.status(500).send("Failed to update user photo.");
  }
};

export const getPhoto = (req, res) => {
  const filePath = path.resolve("uploads", req.params.filename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).send("Image not found.");
  }

  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
  };

  const mimeType = mimeTypes[ext] || "application/octet-stream";
  res.setHeader("Content-Type", mimeType);
  res.setHeader("Content-Disposition", "inline");
  res.sendFile(filePath);
};
