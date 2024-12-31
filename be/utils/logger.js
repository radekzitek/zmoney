const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');
const path = require('path');

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new transports.DailyRotateFile({
      filename: path.join(__dirname, '../logs/error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxSize: '20m',
      maxFiles: '14d'
    }),
    new transports.DailyRotateFile({
      filename: path.join(__dirname, '../logs/combined-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d'
    })
  ]
});

module.exports = logger; 