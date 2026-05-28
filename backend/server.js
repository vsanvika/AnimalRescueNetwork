require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const connectDB = require('./config/db');
const { socketHandler } = require('./socket/socketHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const rescueRoutes = require('./routes/rescueRoutes');
const adoptionRoutes = require('./routes/adoptionRoutes');
const lostFoundRoutes = require('./routes/lostFoundRoutes');
const chatRoutes = require('./routes/chatRoutes');
const volunteerRoutes = require('./routes/volunteerRoutes');
const donationRoutes = require('./routes/donationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  'http://localhost:5173',
  'https://animal-rescue-network-qm1ahzr0q-vsanvikas-projects.vercel.app',
];
if (process.env.CLIENT_URL) {
  allowedOrigins.push(process.env.CLIENT_URL);
}

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || (origin && origin.endsWith('.vercel.app'))) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

// Socket.IO setup
const io = new Server(server, {
  cors: corsOptions,
});
socketHandler(io);

// Database
connectDB();

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API Routes
const apiRouter = express.Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/rescue', rescueRoutes);
apiRouter.use('/adoption', adoptionRoutes);
apiRouter.use('/lostfound', lostFoundRoutes);
apiRouter.use('/chat', chatRoutes);
apiRouter.use('/volunteers', volunteerRoutes);
apiRouter.use('/donations', donationRoutes);
apiRouter.use('/admin', adminRoutes);
apiRouter.use('/notifications', notificationRoutes);

// Health check
apiRouter.get('/health', (req, res) => res.json({ status: 'OK', message: 'Animal Rescue Network API is running 🐾' }));

// Mount routes with and without /api prefix to support frontend misconfigurations
app.use('/api', apiRouter);
app.use('/', apiRouter);

// 404 handler
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({ message: err.message, stack: process.env.NODE_ENV === 'production' ? null : err.stack });
});

const PORT = process.env.PORT || 5000;
server.on('error', (error) => {
  if (error.syscall !== 'listen') throw error;

  const bind = typeof PORT === 'string' ? `Pipe ${PORT}` : `Port ${PORT}`;

  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges.`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use. Stop the process using port ${PORT} or set a different PORT in .env.`);
      process.exit(1);
      break;
    default:
      throw error;
  }
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
