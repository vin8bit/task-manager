const pool = require('../config/database');

class Task {
    static async create(userId, taskData) {
        const { title, description, status, priority, due_date } = taskData;
        console.log('Creating task with data:', { userId, title, description, status, priority, due_date });
        
        try {
            const [result] = await pool.execute(
                'INSERT INTO tasks (user_id, title, description, status, priority, due_date) VALUES (?, ?, ?, ?, ?, ?)',
                [userId, title, description || '', status || 'pending', priority || 'medium', due_date]
            );
            console.log('Task created with ID:', result.insertId);
            return result.insertId;
        } catch (error) {
            console.error('Database error in Task.create:', error);
            throw error;
        }
    }

    static async findByUser(userId, filters = {}) {
        console.log('Finding tasks for user:', userId, 'filters:', filters);
        
        let query = 'SELECT * FROM tasks WHERE user_id = ?';
        const params = [userId];
        
        // Apply filters
        if (filters.status) {
            query += ' AND status = ?';
            params.push(filters.status);
        }
        
        if (filters.priority) {
            query += ' AND priority = ?';
            params.push(filters.priority);
        }
        
        if (filters.search) {
            query += ' AND (title LIKE ? OR description LIKE ?)';
            params.push(`%${filters.search}%`, `%${filters.search}%`);
        }
        
        // Apply sorting
        if (filters.sortBy === 'due_date') {
            query += ' ORDER BY due_date ' + (filters.sortOrder || 'ASC');
        } else if (filters.sortBy === 'priority') {
            query += ' ORDER BY FIELD(priority, "high", "medium", "low") ' + (filters.sortOrder || 'DESC');
        } else {
            query += ' ORDER BY created_at DESC';
        }
        
        console.log('Executing query:', query);
        console.log('With params:', params);
        
        try {
            const [rows] = await pool.execute(query, params);
            console.log('Found tasks:', rows.length);
            return rows;
        } catch (error) {
            console.error('Database error in Task.findByUser:', error);
            throw error;
        }
    }

    static async findById(id, userId) {
        const [rows] = await pool.execute(
            'SELECT * FROM tasks WHERE id = ? AND user_id = ?',
            [id, userId]
        );
        return rows[0];
    }

    static async update(id, userId, taskData) {
        const { title, description, status, priority, due_date } = taskData;
        const [result] = await pool.execute(
            'UPDATE tasks SET title = ?, description = ?, status = ?, priority = ?, due_date = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?',
            [title, description, status, priority, due_date, id, userId]
        );
        return result.affectedRows > 0;
    }

    static async delete(id, userId) {
        const [result] = await pool.execute(
            'DELETE FROM tasks WHERE id = ? AND user_id = ?',
            [id, userId]
        );
        return result.affectedRows > 0;
    }

    static async getStats(userId) {
        console.log('Getting stats for user:', userId);
        try {
            const [rows] = await pool.execute(
                `SELECT 
                    status,
                    COUNT(*) as count,
                    SUM(CASE WHEN due_date < CURDATE() AND status != 'completed' THEN 1 ELSE 0 END) as overdue
                FROM tasks 
                WHERE user_id = ?
                GROUP BY status`,
                [userId]
            );
            console.log('Stats rows:', rows);
            return rows;
        } catch (error) {
            console.error('Database error in Task.getStats:', error);
            return [];
        }
    }
}

module.exports = Task;