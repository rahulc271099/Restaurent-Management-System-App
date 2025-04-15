const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  generatedAt: { type: Date, default: Date.now },
  totalSales: {
    totalRevenue: Number,
    totalOrders: Number,
  },
  dailySales: [
    {
      date: String,
      totalRevenue: Number,
      totalOrders: Number,
    },
  ],
  categorySales: [
    {
      category: String,
      totalRevenue: Number,
      totalOrders: Number,
    },
  ],
  orders: [
    {
      status: String,
      count: Number,
    },
  ],
  reservations: [
    {
      status: String,
      count: Number,
    },
  ],
  tables: [
    {
      status: String,
      count: Number,
    },
  ],
});

module.exports = mongoose.model("Report", reportSchema);