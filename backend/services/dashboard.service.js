import Sales from "../models/Sales.js";
import Orders from "../models/Order.js";
import Products from "../models/Product.js";
import { getStoreFilter } from "../middleware/store.middleware.js";

// 1. Weekly sales
export const getWeeklySales = async (storeId = null) => {
  const filter = storeId ? { storeId } : {};
  return await Sales.aggregate([
    { $match: filter },
    {
      $group: {
        _id: "$date",
        total: { $sum: "$total" },
      },
    },
    { $sort: { _id: 1 } },
  ]);
};

// 2. Today's summary
export const getTodaySummary = async (storeId = null) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const filter = { createdAt: { $gte: today }, ...(storeId ? { storeId } : {}) };

  const todaysOrders = await Orders.find(filter);

  const totalSales = todaysOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const totalCustomers = new Set(todaysOrders.map(o => o.customerId)).size;
  const totalOrders = todaysOrders.length;
  const avgSale = totalOrders > 0 ? totalSales / totalOrders : 0;

  return { totalSales, totalCustomers, totalOrders, avgSale };
};

// 3. Recent Orders
export const getRecentOrders = async (storeId = null) => {
  const filter = storeId ? { storeId } : {};
  return await Orders.find(filter).sort({ createdAt: -1 }).limit(5);
};

// 4. Popular Products
export const getPopularProducts = async (storeId = null) => {
  const filter = storeId ? { storeId } : {};
  return await Products.find(filter).sort({ sold: -1 }).limit(5);
};
