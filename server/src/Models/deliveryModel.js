const { default: mongoose } = require("mongoose");

const deliverySchema = new mongoose.Schema({
  order_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "orders",
    required: true,
  },
  // You can reference a dedicated Delivery or Driver collection if needed; using User as an example here.
  driver_id: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  status: {
    type: String,
    enum: ["assigned", "in-transit", "delivered"],
    default: "assigned",
  },
  tracking_info: { type: String }, // Can store tracking details or a URL for external tracking
},{
    timestamps:true,
},);
