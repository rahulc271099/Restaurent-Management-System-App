const { default: mongoose } = require("mongoose");



const cartSchema = new mongoose.Schema(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
      },
      items: [
        {
          menuItemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "menuItems", // Assuming you have a Product model
            required: true,
          },
          name: String,
          price: Number,
          quantity: {
            type: Number,
            required: true,
            min: 1,
            default: 1,
          },
          image: String, // Optional for displaying cart items
        },
      ],
      totalPrice: {
        type: Number,
        default: 0,
      },
    },
    { timestamps: true }
  );
  
module.exports = new mongoose.model("cart", cartSchema)