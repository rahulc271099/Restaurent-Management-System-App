const { default: mongoose, model } = require("mongoose");

const orderSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
      },
      table_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "tables",
        // Only required if the order_type is "dine-in"
        required: function() {
          return this.order_type === "dine-in";
        },
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
      order_items: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "orderItems" }],
        required: true,
      },
    },{
    timestamps:true,
});


module.exports = new mongoose.model('order', orderSchema)
