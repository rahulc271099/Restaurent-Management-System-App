const tableDB = require("../Models/tableModel");
const userDB = require("../Models/userModel");
const { createToken } = require("../Utilities/generateToken");
const { hashPassword } = require("../Utilities/passwordUtilities");

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }
    const alreadyExist = await userDB.findOne({ email });
    if (alreadyExist) {
      return res.status(400).json({
        error: "Email already exists",
      });
    }

    const hashedPassword = await hashPassword(password);
    const newAdmin = new userDB({
      name,
      email,
      password: hashedPassword,
      role,
    });

    const saved = await newAdmin.save();

    if (saved) {
      return res.status(200).json({
        success: true,
        saved,
      });
    }
  } catch (error) {
    console.log(error);
    res
      .status(error.status || 500)
      .json({ error: error.messege || "Internal server error" });
  }
};




module.exports = { register };
