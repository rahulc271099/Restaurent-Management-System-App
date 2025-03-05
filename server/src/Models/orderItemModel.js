const { default: mongoose } = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  order_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "orders",
    required: true,
  },
  item_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "menuItems",
    required: true,
  },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }, // Snapshot of the item price at the time of ordering
},{
    timestamps:true,
},);

module.exports = new mongoose.model('orderItems', orderItemSchema )