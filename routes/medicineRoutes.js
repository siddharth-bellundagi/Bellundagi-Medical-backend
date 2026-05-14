import express from "express";
import {
  addMedicine,
  getMedicines,
  deleteMedicine,
  updateMedicine,
  getLowStockMedicines,
  getExpiringMedicines,
  getMedicineByBarcode,
} from "../controllers/medicineController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, addMedicine);
router.get("/low-stock", protect, getLowStockMedicines);
router.get("/expiring", protect, getExpiringMedicines);
router.get("/barcode/:code", protect, getMedicineByBarcode);
router.get("/", protect, getMedicines);
router.put("/:id", protect, updateMedicine);
router.delete("/:id", protect, deleteMedicine);

export default router;
