require('dotenv').config();
const express   = require('express');
const cors      = require('cors');
const helmet    = require('helmet');
const morgan    = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/database');

const app = express();
connectDB();

app.use(helmet());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: [
    process.env.FRONTEND_URL,
    'http://localhost:3000',
    'http://127.0.0.1:5500',
    /\.github\.io$/
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Demasiadas solicitudes, intentá de nuevo en 15 minutos' }
});
app.use('/api/', limiter);

const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: 'Límite de consultas IA alcanzado' }
});
app.use('/api/ai/', aiLimiter);

app.use('/api/auth',     require('./routes/auth'));
app.use('/api/ai',       require('./routes/ai'));
app.use('/api/orders',   require('./routes/orders'));
app.use('/api/bookings', require('./routes/bookings'));

app.get('/', (req, res) => res.json({ status: 'ok', service: 'PetConnect Backend', version: '1.0.0' }));
app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use((req, res) => res.status(404).json({ error: `Ruta ${req.path} no encontrada` }));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🐾 PetConnect Backend corriendo en puerto ${PORT}`));

module.exports = app;
