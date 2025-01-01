const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const logger = require('../utils/logger');

// GET all categories
router.get('/', async (req, res) => {
  try {
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

// POST new category
router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body;
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

// ... other category routes

module.exports = router; 