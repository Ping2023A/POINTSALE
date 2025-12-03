import Sales from "../models/Sales.js";
import Orders from "../models/Order.js";
import Products from "../models/Product.js";

// 1. Weekly sales (global)
export const getWeeklySales = async () => {
  return await Sales.aggregate([
    {
      $group: {
        _id: "$date",
        total: { $sum: "$amount" },
      },
    },
    { $sort: { _id: 1 } },
  ]);
};

// 2. Today's summary (global)
export const getTodaySummary = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todaysOrders = await Orders.find({
    createdAt: { $gte: today },
  });

  const totalSales = todaysOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalCustomers = new Set(todaysOrders.map((o) => o.customerId)).size;
  const totalOrders = todaysOrders.length;
  const avgSale = totalOrders > 0 ? totalSales / totalOrders : 0;

  return { totalSales, totalCustomers, totalOrders, avgSale };
};

// 3. Recent Orders (global)
export const getRecentOrders = async () => {
  return await Orders.find()
    .sort({ createdAt: -1 })
    .limit(5);
};

// 4. Popular Products (global)
export const getPopularProducts = async () => {
  return await Products.find()
    .sort({ sold: -1 })
    .limit(5);
};