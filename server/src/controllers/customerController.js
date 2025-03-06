const userDB = require("../Models/userModel");

const getCustomers = async (req, res) => {
  try {
    const customers = await userDB.find({ role: "customer" });
    if (!customers) {
      return res.status(403).json({
        error: "Internal server error",
      });
    }
    res.status(200).json({
      success: true,
      data: customers,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      messege: "Internal server error",
    });
  }
};

module.exports = { getCustomers };
