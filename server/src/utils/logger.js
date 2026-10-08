/**
 * Lightweight Structured Console Logger
 * Provides colorized timestamped logs without heavy external dependencies.
 */
const config = require('../config/environment');

const formatTime = () => new Date().toISOString();

const logger = {
  info: (msg, meta = '') => {
    console.log(`\x1b[36m[${formatTime()}] [INFO]\x1b[0m ${msg}`, meta ? meta : '');
  },
  warn: (msg, meta = '') => {
    console.warn(`\x1b[33m[${formatTime()}] [WARN]\x1b[0m ${msg}`, meta ? meta : '');
  },
  error: (msg, meta = '') => {
    console.error(`\x1b[31m[${formatTime()}] [ERROR]\x1b[0m ${msg}`, meta ? meta : '');
  },
  debug: (msg, meta = '') => {
    if (config.logLevel === 'debug' || !config.isProduction) {
      console.log(`\x1b[35m[${formatTime()}] [DEBUG]\x1b[0m ${msg}`, meta ? meta : '');
    }
  },
  security: (msg, meta = '') => {
    console.warn(`\x1b[41m\x1b[37m[${formatTime()}] [SECURITY AUDIT]\x1b[0m ${msg}`, meta ? meta : '');
  }
};

module.exports = logger;

