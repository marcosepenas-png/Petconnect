const express = require('express');
const router  = express.Router();
const Order   = require('../models/Order');
const auth    = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;
    if (!items || items.length === 0) return res.status(400).json({ error: 'El carrito está vacío' });
    const subtotal = items.reduce((s, x) => s + x.price * x.qty, 0);
    const discount = subtotal >= 20000 ? Math.round(subtotal * 0.1) : 0;
    const total    = subtotal - discount;
    const order = await Order.create({ user: req.user._id, items, subtotal, discount, total, shippingAddress: shippingAddress || null });
    const mpUrl = `https://mp.me/${process.env.MP_ALIAS || 'petconnect'}/${total}`;
    res.status(201).json({ message: 'Orden creada', orderId: order._id, mpUrl, total });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la orden', detail: error.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener pedidos' });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) return res.status(404).json({ error: 'Orden no encontrada' });
    res.json({ order });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la orden' });
  }
});

module.exports = router;
