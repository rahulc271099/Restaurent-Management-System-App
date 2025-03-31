const { generateReport } = require("../Utilities/generateReport");



const getReports = async (req, res) => {
    try {
      const reportData = await generateReport();
      res.status(200).json({ success: true, data: reportData });
    } catch (error) {
      console.error("Error generating report:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  };
  
  module.exports = { getReports };