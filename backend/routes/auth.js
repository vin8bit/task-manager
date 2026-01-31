const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const { validateRegistration, validateLogin, validate } = require('../middleware/validation');

router.post('/register', validateRegistration, validate, authController.register);
router.post('/login', validateLogin, validate, authController.login);
router.get('/profile', authMiddleware, authController.getProfile);

module.exports = router;