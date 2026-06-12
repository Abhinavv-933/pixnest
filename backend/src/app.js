const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('./config/db');
connectDB();

const app = express();

// Middlewares
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://pixnest-kappa.vercel.app"
    ],
    credentials: true
  })
);
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const folderRoutes = require('./routes/folderRoutes');
app.use('/api/folders', folderRoutes);

const imageRoutes = require('./routes/imageRoutes');
app.use('/api/images', imageRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Pixnest API running' });
});

module.exports = app;