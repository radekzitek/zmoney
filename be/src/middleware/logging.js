const morgan = require('morgan');
const logger = require('../utils/logger');

const loggingMiddleware = morgan('combined', {
  stream: {
    write: (message) => {
      logger.info(message.trim(), { source: 'morgan' });
    }
  }
});

module.exports = loggingMiddleware; 