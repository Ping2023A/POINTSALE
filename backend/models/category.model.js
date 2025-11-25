import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true, // ensures no duplicate category names
    },
  },
  { timestamps: true } // optional: createdAt and updatedAt
);

export default mongoose.model("Category", CategorySchema);
