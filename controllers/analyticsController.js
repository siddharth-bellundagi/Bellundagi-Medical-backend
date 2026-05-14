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

// @desc   Monthly comparison (current vs previous month)
// @route  GET /api/analytics/monthly-comparison
// @access Private (Admin)
export const monthlyComparison = async (req, res) => {
  try {
    const now = new Date();

    // Current month range
    const currentStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const currentEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    // Previous month range
    const prevStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    const [currentBills, prevBills] = await Promise.all([
      Bill.find({ createdAt: { $gte: currentStart, $lte: currentEnd } }),
      Bill.find({ createdAt: { $gte: prevStart, $lte: prevEnd } }),
    ]);

    const currentSales = currentBills.reduce((s, b) => s + b.totalAmount, 0);
    const prevSales = prevBills.reduce((s, b) => s + b.totalAmount, 0);

    const salesChange = prevSales > 0
      ? (((currentSales - prevSales) / prevSales) * 100).toFixed(1)
      : currentSales > 0 ? 100 : 0;

    const billsChange = prevBills.length > 0
      ? (((currentBills.length - prevBills.length) / prevBills.length) * 100).toFixed(1)
      : currentBills.length > 0 ? 100 : 0;

    const currentAvg = currentBills.length > 0 ? Math.round(currentSales / currentBills.length) : 0;
    const prevAvg = prevBills.length > 0 ? Math.round(prevSales / prevBills.length) : 0;

    const avgChange = prevAvg > 0
      ? (((currentAvg - prevAvg) / prevAvg) * 100).toFixed(1)
      : currentAvg > 0 ? 100 : 0;

    res.json({
      current: {
        month: currentStart.toLocaleString("default", { month: "long", year: "numeric" }),
        sales: currentSales,
        bills: currentBills.length,
        avgBillValue: currentAvg,
      },
      previous: {
        month: prevStart.toLocaleString("default", { month: "long", year: "numeric" }),
        sales: prevSales,
        bills: prevBills.length,
        avgBillValue: prevAvg,
      },
      changes: {
        sales: Number(salesChange),
        bills: Number(billsChange),
        avgBillValue: Number(avgChange),
      },
    });
  } catch (error) {
    console.error("MONTHLY COMPARISON ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc   Medicine-wise sales breakdown
// @route  GET /api/analytics/medicine-sales?startDate=&endDate=
// @access Private (Admin)
export const medicineSales = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const filter = {};

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = end;
      }
    }

    const bills = await Bill.find(filter);

    const medMap = {};

    bills.forEach((bill) => {
      bill.items.forEach((item) => {
        if (!medMap[item.name]) {
          medMap[item.name] = { name: item.name, qtySold: 0, revenue: 0, billCount: 0 };
        }
        medMap[item.name].qtySold += item.quantity;
        medMap[item.name].revenue += item.totalPrice;
        medMap[item.name].billCount += 1;
      });
    });

    const result = Object.values(medMap).sort((a, b) => b.revenue - a.revenue);

    res.json(result);
  } catch (error) {
    console.error("MEDICINE SALES ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};
