const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId:   { type: Number, required: true },
  name:        { type: String, required: true },
  price:       { type: Number, required: true },
  qty:         { type: Number, required: true, min: 1 }
});

const orderSchema = new mongoose.Schema({
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items:       [orderItemSchema],
  subtotal:    { type: Number, required: true },
  discount:    { type: Number, default: 0 },
  total:       { type: Number, required: true },
  status:      { type: String, enum: ['pending', 'paid', 'cancelled'], default: 'pending' },
  mpPaymentId: { type: String, default: null },
  mpStatus:    { type: String, default: null },
  shippingAddress: { type: String, default: null },
  createdAt:   { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
