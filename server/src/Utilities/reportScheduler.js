const cron = require('node-cron');
const fs = require('fs')
const { generateReport } = require('./generateReport');


cron.schedule('0 0 * * *', async () => {
    try {
      const report = await generateReport();
      // For simplicity, we write the report to a JSON file
      fs.writeFileSync('dailyReport.json', JSON.stringify(report, null, 2));
      console.log("Daily report generated successfully.");
      // Optionally, send the report via email using a mailer service
    } catch (error) {
      console.error("Error generating daily report:", error);
    }
  });