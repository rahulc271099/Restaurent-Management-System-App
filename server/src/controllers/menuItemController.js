const menuItemDB = require("../Models/menuItemModel");

const createMenuItem = async (req, res) => {
  try {
    const { name, description, price, category, availability } = req.body;
    if (!name || !description || !price || !category || !availability) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }

    const newMenuItem = new menuItemDB({
      name,
      description,
      price,
      category,
      availability,
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
    res.status(500).json({ messege:"Internal server error", error });
  }
};

const updateMenuItem = async (req, res) => {
  try {
    const { menuItemId } = req.params;

    const itemExist = await menuItemDB.findOne(menuItemId);
    if (!itemExist) {
      return res.status(400).json({
        error: "Menu item not found",
      });
    }

    const updatedMenuItem = await menuItemDB.findByIdAndUpdate(menuItemId, {
      new: true,
    });
    if (!updatedMenuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

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
    const { menuItemId } = req.body;

    const itemExist = await menuItemDB.findOne(menuItemId);
    if (!itemExist) {
      return res.status(400).json({
        error: "Menu item not found",
      });
    }
    const delettedMenuItem = await menuItemDB.findByIdAndDelete(id);
    if (!delettedMenuItem) {
      return res.status(404).json({
        success: false,
        error: "Menu item not found",
      });
    }
    res.status(200).json({
      success: true,
      messege: "Menu item deletted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

module.exports = { createMenuItem, getMenuItems, updateMenuItem, deleteMenuItem};
