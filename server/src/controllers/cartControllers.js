const { default: mongoose } = require("mongoose");
const cartDB = require("../Models/cartModel");

const getCart = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you have authentication middleware

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Find cart for the user and populate menu item details
    const cart = await cartDB
      .findOne({ userId: new mongoose.Types.ObjectId(userId) })
      .populate("items.menuItemId");

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { menuItemId, name, price, quantity, image } = req.body;

    // Validate IDs
    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(menuItemId)
    ) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    // Find the cart by userId (not _id)
    let cart = await cartDB.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    });

    // If the cart doesn't exist, create a new one
    if (!cart) {
      cart = new cartDB({
        userId: new mongoose.Types.ObjectId(userId),
        items: [],
        totalPrice: 0,
      });
    }

    // Check if item already exists in cart
    const existingItem = cart.items.find(
      (item) => item.menuItemId.toString() === menuItemId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        menuItemId: new mongoose.Types.ObjectId(menuItemId),
        name,
        price,
        quantity,
        image,
      });
    }

    // Recalculate total price
    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    const saved = await cart.save();
    res.status(200).json({
      success: true,
      data: saved,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { menuItemId, quantity } = req.body;

    let cart = await cartDB.findById({ userId });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(
      (item) => item.menuItemId.toString() === menuItemId
    );

    if (!item)
      return res.status(404).json({ message: "Item not found in cart" });

    item.quantity = quantity;

    // Recalculate total price
    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    const saved = await cart.save();
    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const  menuItemId  = req.query.menuItemId;
    console.log(req.query);

    let cart = await cartDB.findOne({ userId });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.menuItemId.toString() !== menuItemId
    );

    // Recalculate total price
    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    const saved = await cart.save();
    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    let cart = await cartDB.findOne({ userId });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = [];
    cart.totalPrice = 0;

    const saved = await cart.save();
    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCart,
  createCartItem,
  updateCartItem,
  deleteCartItem,
  clearCart,
};
