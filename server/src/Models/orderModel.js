const { default: mongoose } = require("mongoose");

const orderSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  order_time: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["pending", "preparing", "delivered", "completed", "cancelled"],
    default: "pending",
  },
  order_type: {
    type: String,
    enum: ["dine-in", "takeaway", "delivery"],
    required: true,
  },
  total_amount: { type: Number, required: true },
  order_items: [{ type: mongoose.Schema.Types.ObjectId, ref: "orderItems" }],
},{
    timestamps:true,
});
