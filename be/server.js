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

// Add this route to your existing routes
app.get('/api/system-info', (req, res) => {
  res.json({
    backend: {
      version: process.env.npm_package_version || '1.0.0',
      status: 'Online',
      environment: process.env.NODE_ENV
    }
  });
});

// Add this route to your existing routes
app.get('/api/counterparties', async (req, res) => {
  try {
    const pool = require('./config/database');
    const result = await pool.query(
      'SELECT id, name, reference, description FROM counterparties ORDER BY name'
    );
    
    res.json(result.rows);
    logger.info('Counterparties fetched successfully', { count: result.rows.length });
  } catch (error) {
    logger.error('Error fetching counterparties:', { error: error.message });
    res.status(500).json({ error: 'Failed to fetch counterparties' });
  }
});

// Add this route to your existing routes
app.get('/api/categories', async (req, res) => {
  try {
    const pool = require('./config/database');
    const result = await pool.query(
      'SELECT id, name, description FROM categories ORDER BY name'
    );
    
    res.json(result.rows);
    logger.info('Categories fetched successfully', { count: result.rows.length });
  } catch (error) {
    logger.error('Error fetching categories:', { error: error.message });
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Add this route to your existing routes
app.get('/api/transactions', async (req, res) => {
  try {
    const pool = require('./config/database');
    const result = await pool.query(`
      SELECT 
        t.id,
        t.transaction_date,
        t.value_date,
        t.amount,
        t.currency,
        t.description,
        t.reference,
        c.name as category_name,
        cp.name as counterparty_name
      FROM transactions t
      LEFT JOIN categories c ON t.category_id = c.id
      LEFT JOIN counterparties cp ON t.counterparty_id = cp.id
      ORDER BY t.transaction_date DESC, t.value_date DESC
    `);
    
    res.json(result.rows);
    logger.info('Transactions fetched successfully', { count: result.rows.length });
  } catch (error) {
    logger.error('Error fetching transactions:', { error: error.message });
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
}); 