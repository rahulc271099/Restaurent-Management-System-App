const { default: mongoose } = require("mongoose");



const tableSchema = new mongoose.Schema({
    capacity: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['available', 'reserved', 'occupied'], 
    default: 'available' 
  },
  // References to Reservation documents if needed (optional)
  reservations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'reservations' }]
})

module.exports = new mongoose.model('tables', tableSchema)