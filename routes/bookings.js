const express = require('express');
const router  = express.Router();
const Booking = require('../models/Booking');
const auth    = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
  try {
    const { serviceId, serviceName, date, time, price } = req.body;
    if (!serviceId || !date || !time) return res.status(400).json({ error: 'serviceId, date y time son requeridos' });
    const existing = await Booking.findOne({ serviceId, date, time, status: 'confirmed' });
    if (existing) return res.status(409).json({ error: 'El turno ya está ocupado' });
    const booking = await Booking.create({ user: req.user._id, serviceId, serviceName, date, time, price });
    res.status(201).json({ message: '¡Turno reservado!', booking });
  } catch (error) {
    res.status(500).json({ error: 'Error al reservar turno', detail: error.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).sort({ date: 1 });
    res.json({ bookings });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener reservas' });
  }
});

router.get('/taken', async (req, res) => {
  try {
    const { serviceId, date } = req.query;
    if (!serviceId || !date) return res.status(400).json({ error: 'serviceId y date son requeridos' });
    const taken = await Booking.find({ serviceId, date, status: 'confirmed' }).select('time');
    res.json({ taken: taken.map(b => b.time) });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener turnos' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id });
    if (!booking) return res.status(404).json({ error: 'Reserva no encontrada' });
    booking.status = 'cancelled';
    await booking.save();
    res.json({ message: 'Reserva cancelada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al cancelar reserva' });
  }
});

module.exports = router;
