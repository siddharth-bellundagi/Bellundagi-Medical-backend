import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    mrp: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    minStock: {
      type: Number,
      required: true,
      default: 10,
    },
  },
  { timestamps: true }
);

const Medicine = mongoose.model("Medicine", medicineSchema);
export default Medicine;
