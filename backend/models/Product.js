// backend/models/Product.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sku: { type: String },
  price: { type: Number, required: true, default: 0 },
  stock: { type: Number, required: true, default: 0 },
  category: { type: String },
  barcode: { type: String }
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
