// backend/server.js
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

// Import routes
import roleRoutes from "./routes/roles.routes.js";
import salesRoutes from "./routes/sales.routes.js"; // ✅ Sales route
import dashboardRoutes from "./routes/dashboard.routes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/roles", roleRoutes);
app.use("/api/sales", salesRoutes); // ✅ Register sales API
app.use("/api/dashboard", dashboardRoutes);

// Health check route
app.get("/", (req, res) => res.send("POS API Running"));

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/pointsale";
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
