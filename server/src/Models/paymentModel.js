const { default: mongoose, mongo } = require("mongoose");

const paymentSchema = new mongoose.Schema({
  order_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "orders",
    required: true,
  },
  payment_method: {
    type: String,
    enum: ["UPI", "card", "cash", "netbanking"],
    required: true,
  },
  amount: { type: Number, required: true },
  payment_status: {
    type: String,
    enum: ["success", "failed", "refunded"],
    default: "success",
  },
  timestamp: { type: Date, default: Date.now },
},{
    timestamps:true,
});

module.exports = new mongoose.model('payments', paymentSchema)
