// backend/server.js
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import productRoutes from "./routes/products.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use("/api/products", productRoutes);

app.get("/", (req, res) => res.send("POS API Running"));

// connect to mongo
const MONGO = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/posdb";
mongoose.connect(MONGO)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
