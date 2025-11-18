// backend/server.js
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

// Import routes
import inventoryRoutes from "./routes/inventory.routes.js";
// Uncomment and fix the path if you have product routes
// import productRoutes from "./routes/product.routes.js";

dotenv.config();

const app = express(); // Initialize Express app

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/inventory", inventoryRoutes);
// Uncomment this if you have product routes
// app.use("/api/products", productRoutes);

app.get("/", (req, res) => res.send("POS API Running"));

// Connect to MongoDB
const MONGO = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/posdb";
mongoose.connect(MONGO)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
