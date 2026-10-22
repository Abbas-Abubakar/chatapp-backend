import "dotenv/config"
import express from 'express'
import cors from "cors"
import cookieParser from 'cookie-parser'
import authRoutes from './routes/auth.routes.js'
import messageRoutes from './routes/message.routes.js'
import userRoutes from './routes/user.routes.js'
import connectToMonogDB from './db/connectToMonogDB.js'
import { app, server } from './socket/socket.js'

const PORT = process.env.PORT || 5000

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}))

app.use(express.json())
app.use(cookieParser())

app.use("/auth", authRoutes)
app.use("/message", messageRoutes)
app.use("/users", userRoutes)

server.listen(PORT, () => {
  connectToMonogDB()
  console.log(`Server running on port ${PORT}`)
})