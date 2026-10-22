const config = require('../config/environment');
const clerkController = require('../controllers/clerk.controller');
const { requireClerkSession } = require('../middleware/clerkAuth.middleware');
const express = require('express');
const authController = require('../controllers/auth.controller');
const validate = require('../middleware/validate.middleware');
const { registerValidator, loginValidator } = require('../validators/auth.validator');
const { authLimiter } = require('../middleware/rateLimiter.middleware');
const { authenticate } = require('../middleware/auth.middleware');

const router = express.Router();

const legacyOnly = (req, res, next) => config.authProvider === 'jwt' ? next() : res.status(404).json({ success: false, message: 'Use Clerk sign-in' });
router.post('/clerk/link', authLimiter, requireClerkSession, clerkController.link);
router.post('/clerk/register', authLimiter, requireClerkSession, clerkController.register);

router.post('/register', legacyOnly, authLimiter, validate(registerValidator), authController.register);
router.post('/login', legacyOnly, authLimiter, validate(loginValidator), authController.login);
router.post('/logout', authenticate, authController.logout);
router.get('/me', authenticate, authController.getMe);
router.get('/profile', authenticate, authController.getProfile);
router.patch('/profile', authenticate, authController.updateProfile);
router.post('/avatar', authenticate, authController.updateAvatar);
router.post('/change-password', authenticate, authController.changePassword);

module.exports = router;


