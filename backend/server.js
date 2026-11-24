const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Security and utility middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
  })
);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    appName: 'FOODIE - Food Recipe App API',
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/recipes', require('./routes/recipeRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/favorites', require('./routes/favoriteRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to FOODIE API Server! Explore recipes at /api/recipes'
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const DEFAULT_PORT = process.env.PORT || 5000;

function startServer(portToTry) {
  const server = app.listen(portToTry, () => {
    console.log(`[FOODIE] Server running in ${process.env.NODE_ENV || 'development'} mode on port ${portToTry}`);
    console.log(`[FOODIE] API Base: http://localhost:${portToTry}/api`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`[FOODIE WARNING] Port ${portToTry} is already in use.`);
      console.log(`[FOODIE TIP] If another server instance is running, you can stop it or run on port ${Number(portToTry) + 1}.`);
      console.log(`[FOODIE] Trying fallback port ${Number(portToTry) + 1}...`);
      startServer(Number(portToTry) + 1);
    } else {
      console.error(`[FOODIE SERVER ERROR]: ${err.message}`);
    }
  });

  return server;
}

startServer(DEFAULT_PORT);

// Handle unhandled promise rejections & uncaught exceptions
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
});

process.on('uncaughtException', (err) => {
  console.error(`Uncaught Exception: ${err.message}`);
});

module.exports = app;
