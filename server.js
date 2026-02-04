import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import medicineRoutes from "./routes/medicineRoutes.js";
import billRoutes from "./routes/billRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";

dotenv.config();

const app = express();

// middlewares
app.use(cors({
  origin: "*",
  credentials: true,
}));
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/medicines", medicineRoutes);
app.use("/api/bills", billRoutes);
app.use("/api/analytics", analyticsRoutes);




// test route
app.get("/", (req, res) => {
  res.send("BELLUNDAGI MEDICALS backend is running");
});

const PORT = process.env.PORT || 5000;
connectDB();


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
