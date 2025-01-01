const express = require('express');
const cors = require('cors');
require('dotenv').config();
const rateLimit = require('express-rate-limit');
const logger = require('./src/utils/logger');
const errorHandler = require('./src/middleware/error');
const loggingMiddleware = require('./src/middleware/logging');

// Route imports
const categoriesRouter = require('./src/routes/categories');
const counterpartiesRouter = require('./src/routes/counterparties');
const transactionsRouter = require('./src/routes/transactions');
const systemRouter = require('./src/routes/system');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(loggingMiddleware);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

// Routes
app.use('/api/categories', categoriesRouter);
app.use('/api/counterparties', counterpartiesRouter);
app.use('/api/transactions', transactionsRouter);
app.use('/api/system', systemRouter);

// Error handling
app.use(errorHandler);

app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
}); 