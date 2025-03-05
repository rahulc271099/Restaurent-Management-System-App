const { default: mongoose } = require("mongoose");

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  price: { type: Number, required: true },
  category: {
    type: String,
    enum: ["appetizer", "main course", "dessert", "beverage"],
    required: true,
  },
  availability: {
    type: String,
    enum: ["in-stock", "out-of-stock"],
    default: "in-stock",
  },
},{
    timestamps:true,
});

module.exports = new mongoose.model('menuItems', menuItemSchema)
