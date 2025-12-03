import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  qty: { type: Number, required: true },
  price: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  customerId: { type: String }, // optional
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Order", orderSchema);
