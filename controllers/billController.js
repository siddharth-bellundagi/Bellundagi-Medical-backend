import Bill from "../models/Bill.js";
import Medicine from "../models/Medicine.js";

// @desc   Create a new bill
// @route  POST /api/bills
// @access Private (Admin)
export const createBill = async (req, res) => {
  try {
    const { items, discount, customerName, customerPhone } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No bill items" });
    }

    let subtotal = 0;
    const billItems = [];

    for (const item of items) {
      const medicine = await Medicine.findById(item.medicineId);

      if (!medicine) {
        return res
          .status(404)
          .json({ message: "Medicine not found" });
      }

      if (medicine.quantity < item.quantity) {
        return res.status(400).json({
          message: `Not enough stock for ${medicine.name}`,
        });
      }

      const totalPrice = medicine.mrp * item.quantity;
      subtotal += totalPrice;

      billItems.push({
        medicine: medicine._id,
        name: medicine.name,
        mrp: medicine.mrp,
        quantity: item.quantity,
        totalPrice,
      });

      // reduce stock
      medicine.quantity -= item.quantity;
      await medicine.save();
    }

    const totalAmount = subtotal - (discount || 0);

    const lastBill = await Bill.findOne().sort({ billNumber: -1 });
    const nextBillNumber = lastBill ? lastBill.billNumber + 1 : 1;

    const bill = await Bill.create({
      billNumber: nextBillNumber,
      customerName: customerName || "Walk-in Customer",
      customerPhone: customerPhone || "",
      items: billItems,
      subtotal,
      discount: discount || 0,
      totalAmount,
    });

    res.status(201).json(bill);
  } catch (error) {
    console.error("CREATE BILL ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// @desc   Get all bills (with optional search/filter)
// @route  GET /api/bills?search=&startDate=&endDate=
// @access Private (Admin)
export const getBills = async (req, res) => {
  try {
    const { search, startDate, endDate } = req.query;
    const filter = {};

    // Date range filter
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = end;
      }
    }

    // Search filter — customer name, phone, or bill number
    if (search) {
      const searchNum = parseInt(search);
      filter.$or = [
        { customerName: { $regex: search, $options: "i" } },
        { customerPhone: { $regex: search, $options: "i" } },
      ];
      if (!isNaN(searchNum)) {
        filter.$or.push({ billNumber: searchNum });
      }
    }

    const bills = await Bill.find(filter).sort({ createdAt: -1 });
    res.json(bills);
  } catch (error) {
    console.error("GET BILLS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc   Delete a bill
// @route  DELETE /api/bills/:id
// @access Private (Admin)
export const deleteBill = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);

    if (!bill) {
      return res.status(404).json({ message: "Bill not found" });
    }

    await bill.deleteOne();
    res.json({ message: "Bill deleted successfully" });
  } catch (error) {
    console.error("DELETE BILL ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};
