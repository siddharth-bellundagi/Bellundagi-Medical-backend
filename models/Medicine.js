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
    category: {
      type: String,
      enum: [
        "Tablet",
        "Syrup",
        "Injection",
        "Capsule",
        "Ointment",
        "Drops",
        "Powder",
        "Other",
      ],
      default: "Other",
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
    barcode: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Medicine = mongoose.model("Medicine", medicineSchema);
export default Medicine;
