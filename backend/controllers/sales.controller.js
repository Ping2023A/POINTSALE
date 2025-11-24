import Sales from "../models/Sales.js";

// Get last 7 days sales
export const getWeeklySales = async (req, res) => {
  try {
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6);

    const sales = await Sales.find({
      date: { $gte: sevenDaysAgo, $lte: today },
    }).sort({ date: 1 });

    const formatted = sales.map((s) => ({
      date: s.date.toISOString().split("T")[0],
      total: s.total,
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
