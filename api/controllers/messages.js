import { db } from "../db.js"

export const getUserMessages = (req, res) => {
    const userId = req.user.userId
    const queue = "SELECT * FROM messages WHERE userId=?"
    db.query(queue, [userId], (err, data) => {
        if (err) return res.status(500).json("Error while trying to get user messages.")
        return res.status(200).json(data)
    })
}

export const postMessage = (req, res) => {
    const userId = req.user.userId
    const { prompt, message } = req.body
    if (prompt === null || prompt.trim() === "" || message === null || message.trim() === "") {
        return res.status(400).send({"data": "Invalid Parameters."})
    }
    const query = "INSERT INTO messages (userId, prompt, message) VALUES (?, ?, ?)"
    db.query(query, [userId, prompt, message], (err, results) => {
        if (err) return res.status(500).send("Error while saving user prompt.")
        return res.status(201).json({prompt, message})
    })
}