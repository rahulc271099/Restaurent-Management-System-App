const userDB = require("../Models/userModel");
const { createToken } = require("../Utilities/generateToken");
const { comparePassword } = require("../Utilities/passwordUtilities");

const login = async (req, res) => {
  // Query the unified users collection
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      error: "Email and password required",
    });
  }

  const user = await userDB.findOne({ email });
  if (!user) {
    return res.status(400).json({
      error: "User not found",
    });
  }
  const passwordMatch = await comparePassword(password, user.password);
  if (!passwordMatch) {
    return res.status(400).json({
      error: "Password does not match",
    });
  }

  res.clearCookie("token");
  const token = createToken(user._id, user.role);
  res.cookie("token", token, {
    httpOnly: true, // ✅ Prevents XSS attacks
    secure: true, // ✅ Uses HTTPS in production
    sameSite: "None",
    path: "/", // Make the cookie available site-wide
    maxAge: 24 * 60 * 60 * 1000,
  });
  res.status(200).json({
    success: true,
    messege: `${user.role} login successful`,
    user:{ id: user._id, role: user.role, email: user.email },
    token
  });
};

const logOut = (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({
      messege: "Logout successful",
    });
  } catch (error) {
    console.log(error);
    res
      .status(error.status || 500)
      .json({ error: error.messege || "Internal server error" });
  }
};

module.exports = { login, logOut };
