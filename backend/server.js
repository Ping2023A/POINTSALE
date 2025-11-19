// backend/server.js
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

// Import routes
import inventoryRoutes from "./routes/inventory.routes.js";
import auditRoutes from "./routes/audit.routes.js";
import roleRoutes from "./routes/roles.routes.js";

// Uncomment and fix the path if you have product routes
// import productRoutes from "./routes/product.routes.js";

dotenv.config();

const app = express(); // Initialize Express app

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/inventory", inventoryRoutes);
app.use("/api/audit", auditRoutes);
app.use("/api/roles", roleRoutes);

// Uncomment this if you have product routes
// app.use("/api/products", productRoutes);

app.get("/", (req, res) => res.send("POS API Running"));

// Connect to MongoDB
const MONGO = process.env.MONGO_URI || "mongodb+srv://<db_username>:<db_password>@cluster0.wephneg.mongodb.net/?appName=Cluster0";
mongoose.connect(MONGO)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
