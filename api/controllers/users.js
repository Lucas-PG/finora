import { db } from "../db.js"
import { v4 as uuidv4 } from "uuid"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import fetch from "node-fetch"
import bcrypt from "bcrypt"

dotenv.config()
const JWT_SECRET = process.env.JWT_SECRET
const CAPTCHA_SECRET = process.env.CAPTCHA_SECRET

export const login = async (req, res) => {
    const { email, password, captchaToken } = req.body
    if (email === null || email.trim() === "" || password === null || password.trim() === "") {
        return res.status(401).send({"data": "Invalid Credentials."})
    }
    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${CAPTCHA_SECRET}&response=${captchaToken}`;
    const captchaResponse = await fetch(verificationUrl, { method: "POST" })
    const data = await captchaResponse.json()
    if (!data.success) {
        return res.status(400).send({"data": "Captcha Validation Failed. Try again."})
    }
    const queue = "SELECT uuid, password FROM users WHERE email=?"
    db.query(queue, [email], async (err, data) => {
        if (err) return res.json("Error while trying to login.")
        if (data.length === 0) return res.status(401).send({ data: "User not found" })
        const user = data[0];
        const passwordMatch = await bcrypt.compare(password, user.password)
        if (!passwordMatch) {
            return res.status(401).send({"data": "Invalid Credentials."})
        }
        const token = jwt.sign({ userId: user.uuid }, JWT_SECRET, { expiresIn: "1h" })
        return res.status(200).json({ token, name: user.name })
    })
}

export const verifyToken = (_, res) => {
    return res.status(200).json({ data: "Valid Token." })
}

export const postUser = async (req, res) => {
    const { name, email, password, confirmPassword, captchaToken } = req.body
    if (captchaToken === null) {
        return res.status(400).send({"data": "Invalid Captcha."})
    }
    if (name === null || name.trim() === "" || email === null || email.trim() === "" || password === null || password.trim() === "") {
        return res.status(400).send({"data": "Invalid Parameters."})
    }
    if (password !== confirmPassword) {
        return res.status(400).send({"data": "Password is not equal to Confirm Password"})
    }
    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${CAPTCHA_SECRET}&response=${captchaToken}`;
    await fetch(verificationUrl, { method: "POST" }).then(async res => {
        const data = await res.json()
        if (!data.success) {
            return res.status(400).send({"data": "Captcha Validation Failed. Try again."})
        }
    })
    const salt = 10
    const hashPassword = await bcrypt.hash(password, salt)
    const uuid = uuidv4()
    const query = "INSERT INTO users (uuid, name, email, password) VALUES (?, ?, ?, ?, ?)"
    db.query(query, [uuid, name, email, hashPassword], (err, results) => {
        if (err) return res.status(500).send("Error while registering user. Email already been registered.")
        return res.status(201).json({id: results.insertId, name, email, password})
    })
}

export const getUserInfo = (req, res) => {
    const userId = req.user.userId
    const query = "SELECT name, email FROM users WHERE uuid=?"
    db.query(query, [userId], (err, results) => {
        if (err) return res.status(500).send(err)
        return res.status(200).json(results)
    })
}

export const updateUserPassword = async (req, res) => {
    const { password, confirmPassword } = req.body
    if ((password === null || password.trim() === "") || (confirmPassword === null || confirmPassword.trim() === "")) {
        return res.status(400).send({"data": "Invalid Parameters."})
    }
    if (password !== confirmPassword) {
        return res.status(400).send({"data": "Password is not equal to Confirm Password"})
    }
    const salt = 10
    const hashPassword = await bcrypt.hash(password, salt)
    const userId = req.user.userId
    const query = "UPDATE users SET password=? WHERE uuid=?"
    db.query(query, [hashPassword, userId], (err, results) => {
        if (err) return res.status(500).send("Error while updating password. Try again later.")
        return res.status(200).json({"data": "Password updated."})
    })
}