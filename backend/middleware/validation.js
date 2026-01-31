const { body, validationResult } = require('express-validator');

const validateRegistration = [
    body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const validateLogin = [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
];

const validateTask = [
    body('title').notEmpty().withMessage('Title is required'),
    body('status').isIn(['pending', 'in-progress', 'completed']).optional(),
    body('priority').isIn(['low', 'medium', 'high']).optional()
];

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = {
    validateRegistration,
    validateLogin,
    validateTask,
    validate
};