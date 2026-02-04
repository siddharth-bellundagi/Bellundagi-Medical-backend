import mongoose from "mongoose";

const billItemSchema = new mongoose.Schema(
  {
    medicine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Medicine",
      required: true,
    },
    name: {
      type: String,
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
    totalPrice: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const billSchema = new mongoose.Schema(
  {
    billNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    items: [billItemSchema],
    subtotal: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Bill = mongoose.model("Bill", billSchema);
export default Bill;
