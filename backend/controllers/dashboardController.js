// backend/controllers/dashboardController.js
import Sales from "../models/Sales.js";
import Orders from "../models/Orders.js";
import Products from "../models/Products.js";

// Get all dashboard data
export const getDashboardData = async (req, res) => {
  try {
    // 1. Weekly sales for chart
    const last7DaysSales = await Sales.aggregate([
      {
        $group: {
          _id: "$date",
          total: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // 2. Today's summary
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaysOrders = await Orders.find({ createdAt: { $gte: today } });
    const totalSales = todaysOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const totalCustomers = new Set(todaysOrders.map(o => o.customerId)).size;
    const totalOrders = todaysOrders.length;
    const avgSale = totalOrders > 0 ? totalSales / totalOrders : 0;

    // 3. Recent orders (last 5)
    const recentOrders = await Orders.find().sort({ createdAt: -1 }).limit(5);

    // 4. Popular products (top 5)
    const popularProducts = await Products.find().sort({ sold: -1 }).limit(5);

    res.json({
      weeklySales: last7DaysSales,
      summary: { totalSales, totalCustomers, totalOrders, avgSale },
      recentOrders,
      popularProducts,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
