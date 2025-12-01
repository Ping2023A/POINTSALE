import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

// Routes
import roleRoutes from "./routes/roles.routes.js";
import salesRoutes from "./routes/sales.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import menuRoutes from "./routes/menu.routes.js";
import settingsRoutes from "./routes/settings.routes.js";
import inventoryRoutes from "./routes/inventory.routes.js";
import auditRoutes from "./routes/audit.routes.js";
import ordersRoutes from "./routes/orders.routes.js";
import shiftRoutes from "./routes/shift.routes.js";

import { initializeSettings } from "./controllers/settings.controller.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Route registrations
app.use("/api/roles", roleRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/audit", auditRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/shifts", shiftRoutes);

// Health check
app.get("/", (req, res) => res.send("POS API Running"));

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://sdecastro_db_user:seantest123@please.cospmds.mongodb.net/?appName=please";

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("MongoDB connected");
    await initializeSettings(); // ensures defaults exist before any API call
  })
  .catch((err) => console.error("MongoDB connection error:", err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
