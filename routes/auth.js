const express = require('express');
const router  = express.Router();
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');
const auth    = require('../middleware/auth');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Todos los campos son requeridos' });
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'El email ya está registrado' });
    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);
    res.status(201).json({ message: '¡Registro exitoso!', token, user });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar usuario', detail: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email y contraseña requeridos' });
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Credenciales incorrectas' });
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ error: 'Credenciales incorrectas' });
    const token = generateToken(user._id);
    res.json({ message: '¡Bienvenido!', token, user });
  } catch (error) {
    res.status(500).json({ error: 'Error al iniciar sesión', detail: error.message });
  }
});

router.get('/me', auth, async (req, res) => {
  res.json({ user: req.user });
});

router.put('/pet', auth, async (req, res) => {
  try {
    const { name, type, age, weight, conditions } = req.body;
    req.user.pet = { name, type, age, weight, conditions };
    await req.user.save();
    res.json({ message: 'Perfil de mascota actualizado', pet: req.user.pet });
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar mascota', detail: error.message });
  }
});

module.exports = router;
