const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');

// GET system info
router.get('/info', (req, res) => {
  res.json({
    backend: {
      version: process.env.npm_package_version || '1.0.0',
      status: 'Online',
      environment: process.env.NODE_ENV
    }
  });
});

// POST frontend logs
router.post('/logs', (req, res) => {
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

module.exports = router; 