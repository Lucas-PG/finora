import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()
const JWT_SECRET = process.env.JWT_SECRET

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) return res.status(401).send({ data: "Token not provided." })
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(401).send({ data: "Invalid token" })
        req.user = user
        next()
    })
}