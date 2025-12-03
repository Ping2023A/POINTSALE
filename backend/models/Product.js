import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  sold: { type: Number, default: 0 },
});

export default mongoose.model("Product", productSchema);
