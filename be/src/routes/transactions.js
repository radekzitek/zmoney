const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const logger = require('../utils/logger');

// GET all transactions
router.get('/', async (req, res) => {
  try {
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
        cp.name as counterparty_name,
        t.created_at,
        t.updated_at
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

// POST new transaction
router.post('/', async (req, res) => {
  try {
    const { 
      transaction_date,
      value_date,
      amount,
      currency,
      description,
      reference,
      category_id,
      counterparty_id
    } = req.body;

    const result = await pool.query(
      `INSERT INTO transactions 
       (transaction_date, value_date, amount, currency, description, reference, category_id, counterparty_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [transaction_date, value_date, amount, currency, description, reference, category_id, counterparty_id]
    );

    res.status(201).json(result.rows[0]);
    logger.info('Transaction created successfully', { id: result.rows[0].id });
  } catch (error) {
    logger.error('Error creating transaction:', { error: error.message });
    res.status(500).json({ error: 'Failed to create transaction' });
  }
});

// Additional transaction routes to be implemented
// PUT /transactions/:id
// DELETE /transactions/:id

module.exports = router; 