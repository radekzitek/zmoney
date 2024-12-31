const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const logger = require('./utils/logger');
require('dotenv').config();
const rateLimit = require('express-rate-limit');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Morgan middleware with Winston integration
app.use(morgan('combined', {
  stream: {
    write: (message) => {
      // Only write to log file, skip console
      logger.info(message.trim(), { source: 'morgan' });
    }
  }
}));

// Example route with logging
app.get('/api/test', (req, res) => {
  logger.info('Test endpoint called', {
    timestamp: new Date(),
    path: req.path,
    query: req.query
  });
  
  res.json({ message: 'Backend is working!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', {
    error: err.message,
    stack: err.stack,
    path: req.path
  });
  
  res.status(500).json({ 
    error: 'Internal server error' 
  });
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Add this route after your existing routes
app.post('/api/logs', limiter, (req, res) => {
  const { level = 'info', message, meta = {} } = req.body;
  
  // Validate log level
  const validLevels = ['info', 'warn', 'error'];
  if (!validLevels.includes(level)) {
    return res.status(400).json({ 
      error: 'Invalid log level' 
    });
  }

  // Validate message
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ 
      error: 'Message is required and must be a string' 
    });
  }

  logger[level](message, {
    source: 'frontend',
    timestamp: new Date(),
    ...meta
  });

  res.json({ status: 'ok' });
});

app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
}); 