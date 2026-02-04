import Medicine from "../models/Medicine.js";

// @desc   Add new medicine
// @route  POST /api/medicines
// @access Private (Admin)
export const addMedicine = async (req, res) => {
  try {
    const { name, company, expiryDate, mrp, quantity, minStock } = req.body;

    const medicine = await Medicine.create({
      name,
      company,
      expiryDate,
      mrp,
      quantity,
      minStock,
    });

    res.status(201).json(medicine);
  } catch (error) {
    console.error("ADD MEDICINE ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc   Get all medicines
// @route  GET /api/medicines
// @access Private (Admin)
export const getMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find().sort({ createdAt: -1 });
    res.json(medicines);
  } catch (error) {
    console.error("GET MEDICINES ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc   Delete medicine
// @route  DELETE /api/medicines/:id
// @access Private (Admin)
export const deleteMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    await medicine.deleteOne();
    res.json({ message: "Medicine removed" });
  } catch (error) {
    console.error("DELETE MEDICINE ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// @desc   Get low stock medicines
// @route  GET /api/medicines/low-stock
// @access Private (Admin)
export const getLowStockMedicines = async (req, res) => {
  try {
    const lowStock = await Medicine.find({
      $expr: { $lte: ["$quantity", "$minStock"] },
    });

    res.json(lowStock);
  } catch (error) {
    console.error("LOW STOCK ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

