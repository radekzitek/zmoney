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
      'SELECT id, name, reference, description, created_at, updated_at FROM counterparties ORDER BY name'
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
      'SELECT id, name, description, created_at, updated_at FROM categories ORDER BY name'
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

// Add these routes to handle CRUD operations for counterparties
app.post('/api/counterparties', async (req, res) => {
  try {
    const { name, reference, description } = req.body;
    const pool = require('./config/database');
    
    const result = await pool.query(
      `INSERT INTO counterparties (name, reference, description) 
       VALUES ($1, $2, $3) 
       RETURNING id, name, reference, description, created_at, updated_at`,
      [name, reference, description]
    );
    
    res.status(201).json(result.rows[0]);
    logger.info('Counterparty created successfully', { id: result.rows[0].id });
  } catch (error) {
    logger.error('Error creating counterparty:', { error: error.message });
    res.status(500).json({ error: 'Failed to create counterparty' });
  }
});

app.put('/api/counterparties/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, reference, description } = req.body;
    const pool = require('./config/database');
    
    const result = await pool.query(
      `UPDATE counterparties 
       SET name = $1, reference = $2, description = $3, updated_at = CURRENT_TIMESTAMP
       WHERE id = $4
       RETURNING id, name, reference, description, created_at, updated_at`,
      [name, reference, description, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Counterparty not found' });
    }
    
    res.json(result.rows[0]);
    logger.info('Counterparty updated successfully', { id });
  } catch (error) {
    logger.error('Error updating counterparty:', { error: error.message });
    res.status(500).json({ error: 'Failed to update counterparty' });
  }
});

app.delete('/api/counterparties/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const pool = require('./config/database');
    
    const result = await pool.query(
      'DELETE FROM counterparties WHERE id = $1 RETURNING id',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Counterparty not found' });
    }
    
    res.json({ message: 'Counterparty deleted successfully' });
    logger.info('Counterparty deleted successfully', { id });
  } catch (error) {
    logger.error('Error deleting counterparty:', { error: error.message });
    res.status(500).json({ error: 'Failed to delete counterparty' });
  }
});

// Add CRUD endpoints for categories
app.post('/api/categories', async (req, res) => {
  try {
    const { name, description } = req.body;
    const pool = require('./config/database');
    
    const result = await pool.query(
      `INSERT INTO categories (name, description) 
       VALUES ($1, $2) 
       RETURNING id, name, description, created_at, updated_at`,
      [name, description]
    );
    
    res.status(201).json(result.rows[0]);
    logger.info('Category created successfully', { id: result.rows[0].id });
  } catch (error) {
    logger.error('Error creating category:', { error: error.message });
    res.status(500).json({ error: 'Failed to create category' });
  }
});

app.put('/api/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const pool = require('./config/database');
    
    const result = await pool.query(
      `UPDATE categories 
       SET name = $1, description = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING id, name, description, created_at, updated_at`,
      [name, description, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    res.json(result.rows[0]);
    logger.info('Category updated successfully', { id });
  } catch (error) {
    logger.error('Error updating category:', { error: error.message });
    res.status(500).json({ error: 'Failed to update category' });
  }
});

app.delete('/api/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const pool = require('./config/database');
    
    const result = await pool.query(
      'DELETE FROM categories WHERE id = $1 RETURNING id',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    res.json({ message: 'Category deleted successfully' });
    logger.info('Category deleted successfully', { id });
  } catch (error) {
    logger.error('Error deleting category:', { error: error.message });
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
}); 