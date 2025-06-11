import { db } from "../db.js";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import fs from "fs";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET

export const login = (req, res) => {
  const { email, password } = req.body;
  if (!email?.trim() || !password?.trim()) {
    return res.status(401).send({ data: "Invalid Credentials." });
  }

  db.query(
    "SELECT uuid, password, name FROM users WHERE email=?",
    [email],
    async (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }
      if (results.length === 0) {
        return res.status(401).send({ data: "User not found" });
      }

      const user = results[0];
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).send({ data: "Invalid Credentials." });
      }

      const token = jwt.sign({ userId: user.uuid }, JWT_SECRET, {
        expiresIn: "1h",
      });
      return res.status(200).json({ token, name: user.name });
    }
  );
};

export const verifyToken = (_, res) => {
  return res.status(200).json({ data: "Valid Token." });
};

export const postUser = (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  if (!name?.trim() || !email?.trim() || !password?.trim()) {
    return res.status(400).json({ data: "Invalid Parameters." });
  }
  if (password !== confirmPassword) {
    return res
      .status(400)
      .json({ data: "Password is not equal to Confirm Password" });
  }

  const uuid = uuidv4();
  bcrypt.hash(password, 10, (err, hashPassword) => {
    if (err) {
      return res.status(500).json({ data: "Error encrypting password." });
    }

    db.query(
      "INSERT INTO users (uuid, name, email, password) VALUES (?, ?, ?, ?)",
      [uuid, name, email, hashPassword],
      (err2) => {
        if (err2) {
          return res.status(500).json({
            data: "Error while registering user. Email may already be registered.",
          });
        }
        return res.status(201).json({ name, email });
      }
    );
  });
};

export const getUserInfo = (req, res) => {
  const userId = req.user.userId;
  db.query(
    "SELECT name, email, photo FROM users WHERE uuid=?",
    [userId],
    (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      return res.status(200).json(results);
    }
  );
};

export const updateUserPassword = (req, res) => {
  const { password, confirmPassword } = req.body;

  if (!password?.trim() || !confirmPassword?.trim()) {
    return res.status(400).send({ data: "Invalid Parameters." });
  }
  if (password !== confirmPassword) {
    return res
      .status(400)
      .send({ data: "Password is not equal to Confirm Password" });
  }

  bcrypt.hash(password, 10, (err, hashPassword) => {
    if (err) {
      return res
        .status(500)
        .send("Error while encrypting password. Try again later.");
    }

    const userId = req.user.userId;
    db.query(
      "UPDATE users SET password=? WHERE uuid=?",
      [hashPassword, userId],
      (err2) => {
        if (err2) {
          return res
            .status(500)
            .send("Error while updating password. Try again later.");
        }
        return res.status(200).json({ data: "Password updated." });
      }
    );
  });
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
        false
      );
    }
    callback(null, true);
  },
}).single("photo");

export const uploadUserPhoto = (req, res) => {
  const userId = req.user.userId;
  const filename = req.file.filename;

  db.query(
    "UPDATE users SET photo=? WHERE uuid=?",
    [filename, userId],
    (err) => {
      if (err) {
        return res.status(500).send("Failed to update user photo.");
      }
      return res.status(200).json({ data: "Photo uploaded.", filename });
    }
  );
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
