import express from "express"
import cors from "cors"
import userRoutes from "./routes/users.js"
import messagesRoutes from "./routes/messages.js"
import emailRoutes from "./routes/emails.js"
import dotenv from "dotenv"
import assetsRoutes from "./routes/assets.js";

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())
app.use("/", messagesRoutes)
app.use("/user/", userRoutes)
app.use("/email/", emailRoutes)
app.use("/assets/", assetsRoutes)

app.listen(3001)