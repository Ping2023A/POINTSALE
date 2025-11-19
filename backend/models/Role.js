import mongoose from "mongoose";

const RoleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  permissions: { type: [String], default: [] }
}, { timestamps: true });

export default mongoose.model("Role", RoleSchema);