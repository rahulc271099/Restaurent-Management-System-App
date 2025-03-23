const { default: mongoose, mongo } = require("mongoose");

const paymentSchema = new mongoose.Schema({
  order_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "orders",
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
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
    enum: ["pending","success", "failed", "refunded"],
    default: "success",
  },
  transaction_id: { type: String }, // Stores Razorpay/Stripe transaction ID
  gateway_response: { type: Object }, // Stores full payment gateway response-for debugging failed transaction details
  timestamp: { type: Date, default: Date.now },
},{
    timestamps:true,
});

module.exports = new mongoose.model('payments', paymentSchema)
