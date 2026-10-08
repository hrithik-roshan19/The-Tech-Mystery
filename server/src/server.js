const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config/environment');
const connectDB = require('./config/db');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler.middleware');
const { apiLimiter } = require('./middleware/rateLimiter.middleware');
const { notFound } = require('./utils/apiResponse');
const logger = require('./utils/logger');

const app = express();

// 1. Security & Protection Middlewares
app.use(helmet());
app.use(
  cors({
    origin: config.cors.origin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// 2. Request Parsing Middlewares
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// 3. HTTP Request Logging
if (config.env !== 'test') {
  app.use(morgan(config.isProduction ? 'combined' : 'dev'));
}

// 4. Rate Limiting for all incoming API routes
app.use(config.apiPrefix, apiLimiter);

// 5. Mount Core API Routes
app.use(config.apiPrefix, routes);

// 6. 404 Route Catch-All
app.use((req, res) => {
  return notFound(res, `Route not found: ${req.method} ${req.originalUrl}`);
});

// 7. Central Error Handling Middleware
app.use(errorHandler);

// 8. Server Boot & Database Connection
const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(config.port, () => {
      logger.info(`=======================================================`);
      logger.info(`  HACK THE GRID - CTF CORE ENGINE READY`);
      logger.info(`  Environment: ${config.env.toUpperCase()}`);
      logger.info(`  Listening on: http://localhost:${config.port}`);
      logger.info(`  API Prefix:   ${config.apiPrefix}`);
      logger.info(`  Organizer:    CodeSphere Coding Club (Tula's University)`);
      logger.info(`=======================================================`);
    });

    // Graceful Shutdown Handlers
    const handleShutdown = (signal) => {
      logger.warn(`Received ${signal}. Gracefully terminating CTF Server...`);
      server.close(() => {
        logger.info('HTTP server closed. Exiting process.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => handleShutdown('SIGTERM'));
    process.on('SIGINT', () => handleShutdown('SIGINT'));
  } catch (error) {
    logger.error(`Critical server launch failure: ${error.message}`);
    process.exit(1);
  }
};

// Start if executed directly
if (require.main === module) {
  startServer();
}

module.exports = app;

