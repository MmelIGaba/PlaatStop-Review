const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(), 
    }),
    // In production, add a transport to write to a file or CloudWatch
  ],
});

module.exports = logger;