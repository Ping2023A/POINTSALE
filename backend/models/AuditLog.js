import mongoose from "mongoose";

const AuditLogSchema = new mongoose.Schema({
  email: { type: String, required: true },
  role: { type: String, required: true },
  action: { type: String, required: true },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model("AuditLog", AuditLogSchema);