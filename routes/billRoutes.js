import express from "express";
import {
  createBill,
  getBills,
  deleteBill,
} from "../controllers/billController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createBill);
router.get("/", protect, getBills);
router.delete("/:id", protect, deleteBill);

export default router;

