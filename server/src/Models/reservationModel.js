const { default: mongoose } = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    customer_name: { type: String, required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    table_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tables",
      required: true,
    },
    reservation_time: { type: Date, required: true },
    status: {
      type: String,
      enum: ["confirmed", "waiting", "completed", "cancelled"],
      default: "confirmed",
    },
    // If you need to allow pre-ordering menu items along with a reservation
    menu_items: [{ type: mongoose.Schema.Types.ObjectId, ref: "menuItems" }],
  },
  {
    timestamps: true,
  }
);

module.exports = new mongoose.model("reservation", reservationSchema);
