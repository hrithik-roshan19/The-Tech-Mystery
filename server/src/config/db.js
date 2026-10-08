const mongoose = require('mongoose');
const config = require('./environment');
const logger = require('../utils/logger');

/**
 * Connect to MongoDB with reconnect resilience and connection event listeners.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongodbUri, {
      serverSelectionTimeoutMS: 5000,
      autoIndex: !config.isProduction // Don't auto-build indexes in production for performance
    });

    logger.info(`[Database] MongoDB Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
    
    mongoose.connection.on('error', (err) => {
      logger.error(`[Database] MongoDB runtime connection error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('[Database] MongoDB connection lost. Attempting reconnection...');
    });

    return conn;
  } catch (error) {
    logger.error(`[Database] Failed initial connection to MongoDB: ${error.message}`);
    // In local architecture dev without running Mongo daemon, log warning rather than crashing ungracefully
    if (config.isProduction) {
      process.exit(1);
    } else {
      logger.warn('[Database] Running in development mode without active MongoDB instance. Models and schemas ready.');
    }
  }
};

module.exports = connectDB;
