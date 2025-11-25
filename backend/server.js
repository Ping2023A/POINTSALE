// backend/server.js
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

// Routes
import roleRoutes from "./routes/roles.routes.js";
import salesRoutes from "./routes/sales.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import menuRoutes from "./routes/menu.routes.js"; // Items + categories

dotenv.config();

const app = express();

// =============================
// Middleware
// =============================
app.use(cors());
app.use(express.json()); // important for parsing JSON POST bodies

// =============================
// Route Registrations
// =============================
app.use("/api/roles", roleRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/menu", menuRoutes);

// Health check
app.get("/", (req, res) => res.send("POS API Running"));

// =============================
// MongoDB Connection
// =============================
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/pointsale";

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));


// =============================
// Start Server
// =============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

