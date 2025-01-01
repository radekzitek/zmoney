const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const logger = require('../utils/logger');

// GET all counterparties
router.get('/', async (req, res) => {
  try {
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

// POST new counterparty
router.post('/', async (req, res) => {
  try {
    const { name, reference, description } = req.body;
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

// PUT update counterparty
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, reference, description } = req.body;
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

// DELETE counterparty
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
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

module.exports = router; 