import nodemailer from "nodemailer"
import dotenv from "dotenv"
import { db } from "../db.js"

dotenv.config()
const EMAIL_LOGIN = process.env.EMAIL_LOGIN
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD

function formattedDate() {
  const now = new Date();
  const pad = (n) => n.toString().padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}

export const sendEmail = async (req, res) => {
    const userId = req.user.userId
    const { name, email, message } = req.body
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {user: EMAIL_LOGIN, pass: EMAIL_PASSWORD}
        })
        const options = {from: `"${name}" <${email}>`, to: EMAIL_LOGIN, subject: "Sugestion", text: message}
        await transporter.sendMail(options)
        const query = "INSERT INTO emails (userId, message, timestamp) VALUES (?, ?, ?)"
        db.query(query, [userId, message, formattedDate()], (err, results) => {
            if (err) return res.status(500).send("Error while saving user email.")
            return res.status(200).json({data: "Email sent"})
        })
    } catch (err) {
        return res.status(500).json({data: "Email not sent"})
    }
}