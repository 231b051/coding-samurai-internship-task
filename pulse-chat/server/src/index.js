const express = require("express");
const Message = require("./models/Message");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const authRoutes = require("./routes/auth");

const app = express();
const server = http.createServer(app);

/* ================== MIDDLEWARE ================== */
app.use(cors());
app.use(express.json());

/* ================== ROUTES ================== */
app.use("/auth", authRoutes);

/* ================== DB CONNECTION ================== */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

/* ================== SOCKET.IO SETUP ================== */
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

/* ===== SOCKET AUTH MIDDLEWARE (JWT) ===== */
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;

  if (!token) {
    return next(new Error("Authentication token missing"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.username = decoded.username;
    next();
  } catch (err) {
    return next(new Error("Invalid token"));
  }
});

/* ================== SOCKET LOGIC ================== */
io.on("connection", (socket) => {
  console.log("User connected:", socket.username);

  socket.on("joinRoom", async (room) => {
  socket.join(room);

  const messages = await Message
    .find({ room })
    .sort({ createdAt: 1 })
    .limit(50);

  socket.emit("chatHistory", messages);
});

socket.on("chatHistory", (history) => {
  setMessages(history);
});


 socket.on("sendMessage", async ({ room, message }) => {
  const savedMessage = await Message.create({
    room,
    sender: socket.username,
    text: message
  });

  io.to(room).emit("receiveMessage", savedMessage);
});


  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.username);
  });
});

/* ================== SERVER START ================== */
server.listen(5000, () => {
  console.log("Server running on port 5000");
});
