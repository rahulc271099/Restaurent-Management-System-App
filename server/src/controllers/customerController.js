const userDB = require("../Models/userModel");
const { hashPassword } = require("../Utilities/passwordUtilities");

const registerCustomer = async (req, res) => {
  try {
    const { name, email, phone, password, confirmPassword } = req.body;
    console.log(req.body);
    if (!name || !email || !phone || !password || !confirmPassword) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({
        error: "Password does not match",
      });
    }
    const existinCustomer = await userDB.findOne({email});
    if (existinCustomer) {
      return res.status(400).json({
        error: "User already exist",
      });
    }
    const hashedPassword = await hashPassword(password);
    console.log(hashedPassword);
    const newUser = new userDB({
      name,
      email,
      phone,
      role:"customer",
      password: hashedPassword,
    });
    const saved = await newUser.save();
    res.status(200).json({
      success: true,
      messege: saved,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

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

const updateCustomer = async(req,res) =>{
  try{
    const customerId = req.user.id
    const {name,email,phone,password,confirmPassword} = req.body
    console.log(req.body);
    const existinCustomer = await userDB.findOne({_id:customerId})
    if(!existinCustomer){
      return res.status(400).json({
        error:"Customer not found"
      })
    }
    let hashedPassword = existinCustomer.password
    if (password) {
      if (password !== confirmPassword) {
        return res.status(400).json({ error: "Passwords do not match" });
      }
      hashedPassword = await hashPassword(password);
    }
    const updatedCustomer = await userDB.findByIdAndUpdate({_id:customerId},{name,email,phone,password:hashedPassword},{new:true})
    res.status(200).json({
      success:true,
      data:updatedCustomer,
    })
  }catch(error){
    res.status(500).json({
      success:false,
      error:"Internal server error"
    })
  }
} 

module.exports = { registerCustomer, getCustomers, updateCustomer };
