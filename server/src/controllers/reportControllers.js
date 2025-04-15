const reportDB = require("../Models/reportModel");
const { generateReport } = require("../Utilities/generateReport");



const getReports = async (req, res) => {
    // try {
    //   const reportData = await generateReport();
    //   res.status(200).json({ success: true, data: reportData });
    // } catch (error) {
    //   console.error("Error generating report:", error);
    //   res.status(500).json({ success: false, error: "Internal server error" });
    // }
    try {
      const reports = await reportDB.find().sort({ generatedAt: -1 }); // newest first
      res.status(200).json({ success: true, data: reports });
    } catch (error) {
      console.error("Error fetching all reports:", error);
      res.status(500).json({ success: false, message: "Failed to fetch reports" });
    }
  };

  const getLatestReport = async (req, res) => {
    try {
      const latestReport = await reportDB.findOne().sort({ generatedAt: -1 });
      if (!latestReport) {
        return res.status(404).json({ success: false, message: "No report found" });
      }
      res.status(200).json({ success: true, data: latestReport });
    } catch (error) {
      console.error("Error fetching latest report:", error);
      res.status(500).json({ success: false, message: "Failed to fetch latest report" });
    }
  };
  
  module.exports = { getReports, getLatestReport};