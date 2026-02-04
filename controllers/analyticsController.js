import Bill from "../models/Bill.js";

// @desc   Sales summary between dates
// @route  GET /api/analytics/summary
// @access Private (Admin)
export const salesSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const bills = await Bill.find({
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    });

    const totalSales = bills.reduce(
      (sum, bill) => sum + bill.totalAmount,
      0
    );

    res.json({
      totalSales,
      totalBills: bills.length,
    });
  } catch (error) {
    console.error("SALES SUMMARY ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// @desc   Daily sales data
// @route  GET /api/analytics/daily-sales
// @access Private (Admin)
export const dailySales = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const bills = await Bill.find({
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    });

    const salesMap = {};

    bills.forEach((bill) => {
      const date = bill.createdAt.toISOString().split("T")[0];

      if (!salesMap[date]) {
        salesMap[date] = 0;
      }
      salesMap[date] += bill.totalAmount;
    });

    const result = Object.keys(salesMap).map((date) => ({
      date,
      total: salesMap[date],
    }));

    res.json(result);
  } catch (error) {
    console.error("DAILY SALES ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// @desc   Top selling medicines
// @route  GET /api/analytics/top-medicines
// @access Private (Admin)
export const topMedicines = async (req, res) => {
  try {
    const bills = await Bill.find();

    const medicineMap = {};

    bills.forEach((bill) => {
      bill.items.forEach((item) => {
        if (!medicineMap[item.name]) {
          medicineMap[item.name] = 0;
        }
        medicineMap[item.name] += item.quantity;
      });
    });

    const result = Object.keys(medicineMap).map((name) => ({
      name,
      quantitySold: medicineMap[name],
    }));

    result.sort((a, b) => b.quantitySold - a.quantitySold);

    res.json(result);
  } catch (error) {
    console.error("TOP MEDICINES ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};
