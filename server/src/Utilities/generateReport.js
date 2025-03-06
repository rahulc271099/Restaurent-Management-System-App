const orderDB = require("../Models/orderModel");
const reservationDB = require("../Models/reservationModel");
const tableDB = require("../Models/tableModel");



const generateReport = async () => {
    // Example: aggregate orders by status
    const orderStats = await orderDB.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);
  
    const reservationStats = await reservationDB.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);
  
    const tableStats = await tableDB.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);
  
    return {
      generatedAt: new Date(),
      orders: orderStats,
      reservations: reservationStats,
      tables: tableStats
    };
  };
  
  module.exports = { generateReport };