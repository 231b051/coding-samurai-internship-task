const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

// Load env FIRST
dotenv.config();

// Import DB
const connectDB = require("./config/db");

// Import routes
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

// Connect DB
connectDB();

const app = express();

// 🔴 MIDDLEWARE (MUST BE BEFORE ROUTES)
app.use(express.json()); // <-- THIS FIXES req.body
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
