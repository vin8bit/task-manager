const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/auth');
const { validateTask, validate } = require('../middleware/validation');

router.use(authMiddleware);

router.post('/', validateTask, validate, taskController.createTask);
router.get('/', taskController.getTasks);
router.get('/:id', taskController.getTask);
router.put('/:id', validateTask, validate, taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;