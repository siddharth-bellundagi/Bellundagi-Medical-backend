import Medicine from "../models/Medicine.js";

// @desc   Add new medicine
// @route  POST /api/medicines
// @access Private (Admin)
export const addMedicine = async (req, res) => {
  try {
    const { name, company, category, expiryDate, mrp, quantity, minStock, barcode } = req.body;

    const medicine = await Medicine.create({
      name,
      company,
      category: category || "Other",
      expiryDate,
      mrp,
      quantity,
      minStock,
      barcode: barcode || "",
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

// @desc   Update medicine
// @route  PUT /api/medicines/:id
// @access Private (Admin)
export const updateMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    const { name, company, category, expiryDate, mrp, quantity, minStock, barcode } = req.body;

    medicine.name = name || medicine.name;
    medicine.company = company || medicine.company;
    medicine.category = category || medicine.category;
    medicine.expiryDate = expiryDate || medicine.expiryDate;
    medicine.mrp = mrp !== undefined ? mrp : medicine.mrp;
    medicine.quantity = quantity !== undefined ? quantity : medicine.quantity;
    medicine.minStock = minStock !== undefined ? minStock : medicine.minStock;
    medicine.barcode = barcode !== undefined ? barcode : medicine.barcode;

    const updatedMedicine = await medicine.save();
    res.json(updatedMedicine);
  } catch (error) {
    console.error("UPDATE MEDICINE ERROR:", error);
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

// @desc   Get expiring medicines (30/60/90 days)
// @route  GET /api/medicines/expiring
// @access Private (Admin)
export const getExpiringMedicines = async (req, res) => {
  try {
    const now = new Date();
    const d30 = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const d60 = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);
    const d90 = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

    const expiring = await Medicine.find({
      expiryDate: { $lte: d90 },
    }).sort({ expiryDate: 1 });

    const critical = []; // ≤30 days or already expired
    const warning = [];  // 31-60 days
    const caution = [];  // 61-90 days

    expiring.forEach((med) => {
      const exp = new Date(med.expiryDate);
      if (exp <= d30) critical.push(med);
      else if (exp <= d60) warning.push(med);
      else caution.push(med);
    });

    res.json({ critical, warning, caution, total: expiring.length });
  } catch (error) {
    console.error("EXPIRING MEDICINES ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc   Find medicine by barcode
// @route  GET /api/medicines/barcode/:code
// @access Private (Admin)
export const getMedicineByBarcode = async (req, res) => {
  try {
    const medicine = await Medicine.findOne({ barcode: req.params.code });

    if (!medicine) {
      return res.status(404).json({ message: "No medicine found with this barcode" });
    }

    res.json(medicine);
  } catch (error) {
    console.error("BARCODE LOOKUP ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};
