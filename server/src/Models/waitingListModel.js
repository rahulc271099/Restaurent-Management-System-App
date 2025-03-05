const { default: mongoose, model } = require("mongoose");



const waitingListSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: false },
  customer_name: { type: String, required: true },
  party_size: { type: Number, required: true },
  contact: { type: String },
  status: { 
    type: String, 
    enum: ['waiting', 'notified', 'seated', 'cancelled'],
    default: 'waiting' 
  },
  created_at: { type: Date, default: Date.now },
  table_id: { type: mongoose.Schema.Types.ObjectId, ref: 'tables' }
})

module.exports = new mongoose.model('waitingList', waitingListSchema)