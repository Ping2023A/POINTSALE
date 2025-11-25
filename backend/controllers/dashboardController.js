import {
  getWeeklySales,
  getTodaySummary,
  getRecentOrders,
  getPopularProducts,
} from "../services/dashboard.service.js";

export const getDashboardData = async (req, res) => {
  try {
    const weeklySales = await getWeeklySales();
    const summary = await getTodaySummary();
    const recentOrders = await getRecentOrders();
    const popularProducts = await getPopularProducts();

    res.json({
      weeklySales,
      summary,
      recentOrders,
      popularProducts,
    });
  } catch (err) {
    console.error("Dashboard Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
