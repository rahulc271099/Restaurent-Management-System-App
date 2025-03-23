const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // Common fields for all users
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    phone: { type: String },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "staff", "customer"],
      default: "customer",
      required: true,
    },
    // Optional fields for customers
    loyalty_points: { type: Number, default: 0 },
    // Optional fields for staff
    staffDetails: {
      shift_start: { type: Date },
      shift_end: { type: Date },
      // Specific role for staff if needed (e.g., manager, waiter, chef)
      position: {
        type: String,
        enum: ["manager", "waiter", "chef"],
      },
      //Staff status
      status: { type: String, enum: ["active", "on-leave"], default: "active" },
    },
    // You can also include admin-specific fields here if necessary
    adminDetails: {
      // Add admin-specific fields if required
    },
  },
  { timestamps: true }
);

// Middleware to ensure staffDetails is added only when role = "staff"
userSchema.pre("save", function (next) {
  if (this.role !== "staff") {
    this.staffDetails = undefined; // Removes staffDetails if role is not staff
  } else if (!this.staffDetails) {
    // If staffDetails is missing, set default values
    this.staffDetails = {
      shift_start: null,
      shift_end: null,
      position: "waiter",
      status: "active",
    };
  }
  next();
});

module.exports = new mongoose.model("users", userSchema);
