import mongoose from "mongoose";

const storeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },          // Store name
    owner: { type: String, required: true },         // Owner name
    ownerEmail: { type: String, required: true },    // Owner email
    phone: { type: String },
    address: { type: String },
    currency: { type: String, default: "₱" },
    tax: { type: Number, default: 0 },
    logo: { type: String },                          // Store logo path or URL
    members: [
      {
        email: { type: String, required: true },
        role: { type: String, default: "Staff" },
        joinedAt: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("Store", storeSchema);