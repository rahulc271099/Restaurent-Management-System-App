const { default: mongoose } = require("mongoose");
const menuItemDB = require("../Models/menuItemModel");
const uploadToCloudinary = require("../Utilities/imageUpload");

const createMenuItem = async (req, res) => {
  try {
    const { name, description, price, category, dietary, availability,chefSpecial } = req.body;
    console.log(req.body);
    if (!name || !description || !price || !category || !availability) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        error: "Image not found",
      });
    }
    const cloudinaryResponse = await uploadToCloudinary(req.file.path);

    let tags = req.body.tags;
    if (!Array.isArray(tags)) {
      tags = [tags]; // Convert single value into an array
    }

    const newMenuItem = new menuItemDB({
      name,
      description,
      price,
      category,
      dietary,
      availability,
      image: cloudinaryResponse,
      tags,
      chefSpecial,
    });

    const saved = await newMenuItem.save();

    res.status(200).json({
      success: true,
      data: saved,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

const getMenuItems = async (req, res) => {
  try {
    const { search, category, dietary, minPrice, maxPrice } = req.query;
    const filter = {};

    // Search by name or description (case-insensitive)
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by category
    if (category) {
      filter.category = category;
    }

    // Filter by dietary preference
    if (dietary) {
      filter.dietary = dietary;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    const menuItems = await menuItemDB.find(filter);
    res.status(200).json(menuItems);
  } catch (error) {
    res.status(500).json({ messege: "Internal server error", error });
  }
};

const getChefSpecial = async (req, res) => {
  try {
    const specialItems = await menuItemDB
      .find({ chefSpecial: true, availability: "in-stock" })
      .limit(5);
    if (!specialItems) {
      return res.status(400).json({
        error: "No special items",
      });
    }
    res.status(200).json({
      success: true,
      data: specialItems,
    });
  } catch (error) {
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

const updateChefSpecial = async(req,res) =>{
  try{
    const {menuItemIds} = req.body
  if(!menuItemIds || menuItemIds.length === 0){
    return res.status(400).json({
      error:"No items found"
    })
  }
  const clearPrevChefSpecial = await menuItemDB.updateMany({},{$set:{chefSpecial:false}})
  const updatedItems  = await menuItemDB.updateMany(
    {_id:{$in:menuItemIds}},
    {$set:{chefSpecial:true}}
  )
  const updatedChefSpecial = await menuItemDB.find({chefSpecial:true})
  res.status(200).json({
    success:true,
    data:updatedChefSpecial,
  })
  }catch(error){
    console.log(error);
  }
}

const updateMenuItem = async (req, res) => {
  try {
    const { menuItemId } = req.params;
    const { name, description, price, category, availability } = req.body;
    const itemExist = await menuItemDB.findById(menuItemId);
    if (!itemExist) {
      return res.status(400).json({
        error: "Menu item not found",
      });
    }

    const updatedMenuItem = await menuItemDB.findByIdAndUpdate(
      menuItemId,
      { name, description, price, category, availability },
      {
        new: true,
      }
    );

    res.status(200).json({
      success: true,
      data: updatedMenuItem,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

const deleteMenuItem = async (req, res) => {
  try {
    const { menuItemId } = req.params;
    const itemExist = await menuItemDB.findById(menuItemId);
    if (!itemExist) {
      return res.status(400).json({
        error: "Menu item not found",
      });
    }
    const delettedMenuItem = await menuItemDB.findByIdAndDelete(menuItemId);
    res.status(200).json({
      success: true,
      messege: "Menu item deletted successfully",
      delettedMenuItem,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

module.exports = {
  createMenuItem,
  getMenuItems,
  getChefSpecial,
  updateChefSpecial,
  updateMenuItem,
  deleteMenuItem,
};
