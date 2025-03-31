const orderDB = require("../Models/orderModel");
const reservationDB = require("../Models/reservationModel");
const tableDB = require("../Models/tableModel");

const generateReport = async () => {
  // Aggregate total revenue
  const totalSales = await orderDB.aggregate([
    {
      $match: { status: "completed" }, // Consider only completed orders for sales
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$total_amount" }, // Sum of total_amount field
        totalOrders: { $sum: 1 }, // Total number of completed orders
      },
    },
  ]);

  // Daily Sales Report
  const dailySales = await orderDB.aggregate([
    {
      $match: { status: "completed" },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        totalRevenue: { $sum: "$total_amount" },
        totalOrders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } }, // Sort by date
  ]);

  // Sales by Category
  const categorySales = await orderDB.aggregate([
    {
      $match: { status: "completed" },
    },
    {
      $unwind: "$order_items",
    },
    {
      $lookup: {
        from: "menuitems",
        localField: "order_items.item_id",
        foreignField: "_id",
        as: "menuItem",
      },
    },
    {
      $unwind: "$menuItem",
    },
    {
      $group: {
        _id: "$menuItem.category",
        totalRevenue: { $sum: "$order_items.price" },
        totalOrders: { $sum: 1 },
      },
    },
    { $sort: { totalRevenue: -1 } }, // Sort by revenue
  ]);

  // Example: aggregate orders by status
  const orderStats = await orderDB.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const reservationStats = await reservationDB.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const tableStats = await tableDB.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  return {
    generatedAt: new Date(),
    totalSales: totalSales.length ? totalSales[0] : { totalRevenue: 0, totalOrders: 0 },
    dailySales,
    categorySales,
    orders: orderStats,
    reservations: reservationStats,
    tables: tableStats,
  };
};

module.exports = { generateReport };
