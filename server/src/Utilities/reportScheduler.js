const cron = require("node-cron");
const fs = require("fs");
const { generateReport } = require("./generateReport");
const reportDB = require("../Models/reportModel");

cron.schedule("0 0 * * *", async () => {
  try {
    const report = await generateReport();
    // For simplicity, we write the report to a JSON file
    // fs.writeFileSync('dailyReport.json', JSON.stringify(report, null, 2));
    // console.log("Daily report generated successfully.");
    // Optionally, send the report via email using a mailer service

    await reportDB.create({
      generatedAt: new Date(), // Optional, already defaults in schema
      totalSales: report.totalSales,
      dailySales: report.dailySales.map((sale) => ({
        date: sale._id,
        totalRevenue: sale.totalRevenue,
        totalOrders: sale.totalOrders,
      })),
      categorySales: report.categorySales.map((item) => ({
        category: item._id,
        totalRevenue: item.totalRevenue,
        totalOrders: item.totalOrders,
      })),
      orders: report.orders.map((o) => ({
        status: o._id,
        count: o.count,
      })),
      reservations: report.reservations.map((r) => ({
        status: r._id,
        count: r.count,
      })),
      tables: report.tables.map((t) => ({
        status: t._id,
        count: t.count,
      })),
    });
  } catch (error) {
    console.error("Error generating daily report:", error);
  }
});
