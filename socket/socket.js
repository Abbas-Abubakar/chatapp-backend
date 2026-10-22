import { Server } from "socket.io";
import express from "express"
import http from "http"
import User from "../model/user.model.js"

const app = express()

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"]
  }
})

const userSocketMap = {}

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
}

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  const validUser = userId && userId !== "undefined"

  if (validUser) userSocketMap[userId] = socket.id

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", async () => {
    if (!validUser) return

    // Ignore if the user already reconnected (new tab / refresh) with a newer socket
    if (userSocketMap[userId] !== socket.id) return

    delete userSocketMap[userId]
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // Persist + broadcast last seen
    try {
      const lastSeen = new Date()
      await User.findByIdAndUpdate(userId, { lastSeen })
      io.emit("userLastSeen", { userId, lastSeen })
    } catch (err) {
      console.log("Error saving lastSeen:", err.message)
    }
  });
});

export { app, io, server }
