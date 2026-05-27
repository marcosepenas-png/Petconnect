const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  serviceId:   { type: Number, required: true },
  serviceName: { type: String, required: true },
  date:        { type: String, required: true },
  time:        { type: String, required: true },
  price:       { type: Number, required: true },
  status:      { type: String, enum: ['confirmed', 'cancelled', 'completed'], default: 'confirmed' },
  createdAt:   { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);
