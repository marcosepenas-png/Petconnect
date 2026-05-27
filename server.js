require('dotenv').config();

const express    = require('express');
const cors       = require('cors');
const helmet     = require('helmet');
const morgan     = require('morgan');
const rateLimit  = require('express-rate-limit');
const connectDB  = require('./config/database');

const app = express();

// ─── Conectar a MongoDB ────────────────────────────────────────────────────
connectDB();

// ─── Middlewares globales ──────────────────────────────────────────────────
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// CORS — solo permite el frontend de PetConnect
app.use(cors({
  origin: [
    process.env.FRONTEND_URL,
    'http://localhost:3000',
    'http://127.0.0.1:5500',  // Live Server local
    /\.github\.io$/            // Cualquier subdominio de github.io
  ],
  methods:     ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting — evita abuso de la API
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max:      100,             // 100 requests por ventana
  message:  { error: 'Demasiadas solicitudes, intentá de nuevo en 15 minutos' }
});
app.use('/api/', limiter);

// Rate limiting más estricto para la IA (caro por token)
const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max:      10,
  message:  { error: 'Límite de consultas IA alcanzado, esperá un momento' }
});
app.use('/api/ai/', aiLimiter);

// ─── Rutas ─────────────────────────────────────────────────────────────────
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/ai',       require('./routes/ai'));
app.use('/api/orders',   require('./routes/orders'));
app.use('/api/bookings', require('./routes/bookings'));

// ─── Health check (Render lo usa para saber si el server está vivo) ────────
app.get('/', (req, res) => {
  res.json({
    status:  'ok',
    service: 'PetConnect Backend',
    version: '1.0.0',
    time:    new Date().toISOString()
  });
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

// ─── Manejo de rutas no encontradas ───────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Ruta ${req.path} no encontrada` });
});

// ─── Manejo global de errores ──────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// ─── Iniciar servidor ──────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`
  🐾 PetConnect Backend corriendo
  ──────────────────────────────
  🌐 Puerto   : ${PORT}
  🔧 Entorno  : ${process.env.NODE_ENV || 'development'}
  📦 DB       : MongoDB Atlas
  `);
});

module.exports = app;
