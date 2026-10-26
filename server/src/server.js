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

// Proxy Configuration for Render Reverse Proxy / Load Balancer
if (config.trustProxy) {
  app.set('trust proxy', config.trustProxy);
}

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

    // Ensure critical unique schema indexes are synchronized on boot
    if (config.authProvider === 'clerk') {
      try {
        const { User } = require('./models');
        await User.createIndexes();
        logger.info('[Database] User identity indexes verified and synchronized');
      } catch (indexError) {
        logger.error(`[Database] User index initialization error: ${indexError.message}`);
      }
    }

    // Ensure baseline singleton EventConfig exists and reconcile state with environment if configured
    try {
      const { EventConfig } = require('./models');
      const { EVENT_STATES } = require('./constants/eventStates');
      const desiredState = config.eventState;
      const initialState = desiredState || EVENT_STATES.DRAFT;
      const existingConfig = await EventConfig.getSingleton({
        state: initialState,
        registrationOpen: initialState === EVENT_STATES.REGISTRATION_OPEN || initialState === EVENT_STATES.LIVE
      });

      if (desiredState && existingConfig.state !== desiredState) {
        // Only force environment override if FORCE_EVENT_STATE is set or if document has never been modified by an admin
        const forceReconcile = process.env.FORCE_EVENT_STATE === 'true' || !existingConfig.securityRevision;
        if (forceReconcile) {
          logger.info(`[Database] Reconciling EventConfig state: ${existingConfig.state} -> ${desiredState} from environment`);
          existingConfig.state = desiredState;
          if (desiredState === EVENT_STATES.REGISTRATION_OPEN) {
            existingConfig.registrationOpen = true;
          } else if (desiredState === EVENT_STATES.REGISTRATION_CLOSED) {
            existingConfig.registrationOpen = false;
          }
          await existingConfig.save();
          logger.info(`[Database] EventConfig state reconciled to ${desiredState}`);
        } else {
          logger.info(`[Database] Environment EVENT_STATE=${desiredState} detected, but authoritative database state '${existingConfig.state}' (securityRevision: ${existingConfig.securityRevision}) takes precedence.`);
        }
      }
    } catch (configError) {
      logger.error(`[Database] EventConfig initialization error: ${configError.message}`);
    }

    const server = app.listen(config.port, () => {
      logger.info(`=======================================================`);
      logger.info(`  THE TECH MYSTERY - CTF CORE ENGINE READY`);
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

