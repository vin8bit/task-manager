const Task = require('../models/Task');

const taskController = {
    createTask: async (req, res) => {
        try {
            const taskId = await Task.create(req.userId, req.body);
            const task = await Task.findById(taskId, req.userId);
            res.status(201).json({ message: 'Task created successfully', task });
        } catch (error) {
            console.error('Create task error:', error);
            res.status(500).json({ error: 'Failed to create task' });
        }
    },
    
    getTasks: async (req, res) => {
        try {
            const filters = {
                status: req.query.status,
                priority: req.query.priority,
                search: req.query.search,
                sortBy: req.query.sortBy,
                sortOrder: req.query.sortOrder
            };
            
            const tasks = await Task.findByUser(req.userId, filters);
            const stats = await Task.getStats(req.userId);
            
            res.json({ tasks, stats });
        } catch (error) {
            console.error('Get tasks error:', error);
            res.status(500).json({ error: 'Failed to fetch tasks' });
        }
    },
    
    getTask: async (req, res) => {
        try {
            const task = await Task.findById(req.params.id, req.userId);
            if (!task) {
                return res.status(404).json({ error: 'Task not found' });
            }
            res.json(task);
        } catch (error) {
            console.error('Get task error:', error);
            res.status(500).json({ error: 'Failed to fetch task' });
        }
    },
    
    updateTask: async (req, res) => {
        try {
            const updated = await Task.update(req.params.id, req.userId, req.body);
            if (!updated) {
                return res.status(404).json({ error: 'Task not found' });
            }
            const task = await Task.findById(req.params.id, req.userId);
            res.json({ message: 'Task updated successfully', task });
        } catch (error) {
            console.error('Update task error:', error);
            res.status(500).json({ error: 'Failed to update task' });
        }
    },
    
    deleteTask: async (req, res) => {
        try {
            const deleted = await Task.delete(req.params.id, req.userId);
            if (!deleted) {
                return res.status(404).json({ error: 'Task not found' });
            }
            res.json({ message: 'Task deleted successfully' });
        } catch (error) {
            console.error('Delete task error:', error);
            res.status(500).json({ error: 'Failed to delete task' });
        }
    }
};

module.exports = taskController;