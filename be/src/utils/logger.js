const winston = require('winston');
const path = require('path');
require('winston-daily-rotate-file');

// Define custom log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4
};

// Define structured log format
const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.metadata({
    fillWith: ['timestamp', 'level', 'service']
  }),
  winston.format.json()
);

// Create rotating file transport
const createRotateTransport = (filename, level) => {
  return new winston.transports.DailyRotateFile({
    filename: path.join(__dirname, `../../logs/${filename}-%DATE%.log`),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    level: level,
    format: logFormat
  });
};

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  levels: levels,
  format: logFormat,
  defaultMeta: { 
    service: 'financial-manager',
    environment: process.env.NODE_ENV || 'development'
  },
  transports: [
    // Rotating transport for combined logs
    createRotateTransport('combined', 'info'),
    // Rotating transport for error logs
    createRotateTransport('error', 'error')
  ],
  exitOnError: false
});

// Add request context if available
logger.requestContext = function(req) {
  return {
    requestId: req.id,
    method: req.method,
    path: req.path,
    ip: req.ip
  };
};

module.exports = logger; 