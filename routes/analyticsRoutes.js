import express from "express";
import {
  salesSummary,
  dailySales,
  topMedicines,
} from "../controllers/analyticsController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/summary", protect, salesSummary);
router.get("/daily-sales", protect, dailySales);
router.get("/top-medicines", protect, topMedicines);

export default router;
