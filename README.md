# 🐾 PetConnect Backend

API REST para PetConnect Shop — Node.js + Express + MongoDB

---

## 📁 Estructura

```
petconnect-backend/
├── config/
│   └── database.js        # Conexión a MongoDB
├── middleware/
│   └── auth.js            # Verificación JWT
├── models/
│   ├── User.js            # Usuario + perfil mascota
│   ├── Order.js           # Pedidos
│   └── Booking.js         # Reservas de servicios
├── routes/
│   ├── auth.js            # Register / Login / Me / Pet
│   ├── ai.js              # Proxy seguro → Claude API
│   ├── orders.js          # Pedidos + Mercado Pago
│   └── bookings.js        # Reservas de turnos
├── server.js              # Entry point
├── package.json
├── .env.example
└── .gitignore
```

---

## 🚀 Deploy en Render (gratis)

### 1. Crear base de datos en MongoDB Atlas
- Ir a [mongodb.com/atlas](https://www.mongodb.com/atlas) → Free tier
- Crear cluster → Obtener connection string

### 2. Subir a GitHub
```bash
git init
git add .
git commit -m "Initial backend"
git remote add origin https://github.com/TU_USUARIO/petconnect-backend.git
git push -u origin main
```

### 3. Crear servicio en Render
- Ir a [render.com](https://render.com) → New → Web Service
- Conectar el repositorio de GitHub
- Configurar:
  - **Build Command:** `npm install`
  - **Start Command:** `npm start`
  - **Environment:** Node

### 4. Agregar variables de entorno en Render
En el panel de Render → Environment → Add variables:

| Variable | Valor |
|---|---|
| `MONGODB_URI` | Tu string de MongoDB Atlas |
| `JWT_SECRET` | Una cadena larga y aleatoria |
| `ANTHROPIC_API_KEY` | Tu key de Anthropic |
| `MP_ACCESS_TOKEN` | Tu access token de Mercado Pago |
| `FRONTEND_URL` | URL de tu GitHub Pages |
| `NODE_ENV` | `production` |

---

## 📡 Endpoints

### Auth
| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/auth/register` | Registrar usuario |
| POST | `/api/auth/login` | Iniciar sesión |
| GET  | `/api/auth/me` | Perfil del usuario (🔒) |
| PUT  | `/api/auth/pet` | Guardar mascota (🔒) |

### IA
| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/ai/chat` | Consulta a Claude (🔒) |

### Pedidos
| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/orders` | Crear orden + link MP (🔒) |
| GET  | `/api/orders` | Mis pedidos (🔒) |
| GET  | `/api/orders/:id` | Detalle pedido (🔒) |
| POST | `/api/orders/webhook` | Webhook Mercado Pago |

### Reservas
| Método | Ruta | Descripción |
|---|---|---|
| POST   | `/api/bookings` | Reservar turno (🔒) |
| GET    | `/api/bookings` | Mis reservas (🔒) |
| GET    | `/api/bookings/taken` | Turnos ocupados |
| DELETE | `/api/bookings/:id` | Cancelar reserva (🔒) |

> 🔒 = Requiere header `Authorization: Bearer TOKEN`

---

## 🔧 Desarrollo local

```bash
# Instalar dependencias
npm install

# Copiar y completar variables de entorno
cp .env.example .env

# Correr en modo desarrollo
npm run dev
```

---

## 👥 Equipo UAI 2026
Marcos Penas · Delfina Giugliarelli · Manuela Curri · Aylen Alvarez · Federico Villarruel
