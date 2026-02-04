import express from "express";
import {
  addMedicine,
  getMedicines,
  deleteMedicine,
  getLowStockMedicines,
} from "../controllers/medicineController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, addMedicine);
router.get("/low-stock", protect, getLowStockMedicines);
router.get("/", protect, getMedicines);
router.delete("/:id", protect, deleteMedicine);

export default router;
