const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { Server } = require("socket.io");
require("dotenv").config();

const Message = require("./models/Message");
const authRoutes = require("./routes/auth");

const app = express();
const server = http.createServer(app);

/* ================== MIDDLEWARE ================== */
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());

/* ================== HEALTH CHECK ================== */
app.get("/healthz", (req, res) => {
  res.status(200).json({ status: "ok" });
});

/* ================== ROUTES ================== */
app.use("/auth", authRoutes);

/* ================== DB CONNECTION ================== */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

/* ================== SOCKET.IO ================== */
const io = new Server(server, {
  cors: { origin: "*" },
});

io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error("No token"));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.username = decoded.username;
    next();
  } catch {
    next(new Error("Invalid token"));
  }
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.username);

  socket.on("joinRoom", async (room) => {
    socket.join(room);
    const messages = await Message.find({ room }).sort({ createdAt: 1 }).limit(50);
    socket.emit("chatHistory", messages);
  });

  socket.on("sendMessage", async ({ room, message }) => {
    const saved = await Message.create({
      room,
      sender: socket.username,
      text: message,
    });
    io.to(room).emit("receiveMessage", saved);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.username);
  });
});

/* ================== START SERVER ================== */
const PORT = process.env.PORT;

server.listen(PORT, () => {
  console.log("Server running on port", PORT);
});

