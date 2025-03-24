const { default: mongoose } = require("mongoose");

const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    price: { type: Number, required: true },
    category: {
      type: String,
      enum: ["appetizer", "main course", "dessert", "beverage"],
      required: true,
    },
    image: { type: String, required: true },
    dietary: {
      type: String,
      enum: ["vegetarian", "vegan", "gluten-free", "non-vegetarian"],
    },
    availability: {
      type: String,
      enum: ["in-stock", "out-of-stock"],
      default: "in-stock",
    },
    tags: {
      type: [String],
      default:[],
      // enum: ["popular", "seasonal","dessert","gluten-free","healthy","signature"],
    },
    salesCount: { type: Number, default: 0 }, // For tracking popular items
    rating: { type: Number, default: 0 }, // Average customer rating
    chefSpecial: { type: Boolean, default: false }, // New field for Chef’s Special
  },
  {
    timestamps: true,
  }
);

module.exports = new mongoose.model("menuItems", menuItemSchema);
