import express from "express";
import { registerAdmin, loginAdmin } from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";


const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.get("/profile", protect, (req, res) => {
  res.json(req.user);
});


export default router;

