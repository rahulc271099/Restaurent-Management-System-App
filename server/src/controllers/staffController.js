const userDB = require("../Models/userModel");
const { createToken } = require("../Utilities/generateToken");
const {
  hashPassword,
  comparePassword,
} = require("../Utilities/passwordUtilities");

const createStaff = async (req, res) => {
  try {
    const { name, email, password, phone, staffDetails } = req.body;
    console.log(req.body);
    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }
    const existinfStaff = await userDB.findOne({ email });
    if (existinfStaff) {
      return res.status(400).json({
        error: "Staff already exists",
      });
    }
    const hashedPassword = await hashPassword(password);
    const newStaff = new userDB({
      name,
      role:'staff',
      staffDetails: {
        shift_start: staffDetails?.shift_start,
        shift_end: staffDetails?.shift_end,
        position: staffDetails?.position,
        status: staffDetails?.status,
      },
      email,
      phone,
      password: hashedPassword,
    });

    const saved = await newStaff.save();
    res.status(200).json({
      success: true,
      data: saved,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      messege: "Internal server errer",
    });
  }
};

const getStaff = async (req, res) => {
  try {
    const staffs = await userDB.find({ role: "staff" });
    if (!staffs) {
      return res.status(404).json({
        error: "No staffs found",
      });
    }
    res.status(200).json({
      success: true,
      data: staffs,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

const updateStaff = async (req, res) => {
  try {
    const { staffId } = req.params;
    console.log(req.body);
    const { name, role, email, phone, password, staffDetails } = req.body;
    const staff = await userDB.findById(staffId);
    if (!staff) {
      return res.status(400).json({
        error: "Staff not found",
      });
    }

    // Prepare update object
    const updatedData = {
      name,
      email,
      phone,
      role:'staff',
      staffDetails,
    };

    // Only hash and update the password if it's provided
    if (password) {
      updatedData.password = await hashPassword(password);
    }


    const updatedStaff = await userDB.findByIdAndUpdate(
      staffId,
      updatedData,
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: updatedStaff,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

const deleteStaff = async (req, res) => {
  try {
    const { staffId } = req.params;
    const staff = await userDB.findById(staffId);
    if (!staff) {
      return res.status(400).json({
        error: "Staff not found",
      });
    }
    const delettedStaff = await userDB.findByIdAndDelete(staffId);
    res.status(200).json({
      success: true,
      messege: "Staff removed successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

module.exports = { createStaff, getStaff, updateStaff, deleteStaff };
