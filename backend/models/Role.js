// backend/models/Role.js
import mongoose from "mongoose";

const RoleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, required: true },
    storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' },
    date: { type: String, required: true },
    phone: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model("Role", RoleSchema);
