class TaskManager {
    constructor() {
        console.log('TaskManager initialized');
        this.auth = auth;
        this.currentFilters = {};
        this.init();
    }

    init() {
        console.log('TaskManager init. Current page:', window.location.pathname);
        
        if (window.location.pathname.includes('create-task.html')) {
            console.log('Initializing create task page');
            this.initCreateTask();
        } else if (window.location.pathname.includes('manage-tasks.html')) {
            console.log('Initializing manage tasks page');
            this.initManageTasks();
        }
    }

    initCreateTask() {
        const taskForm = document.getElementById('taskForm');
        if (taskForm) {
            console.log('Create task form found, adding listener');
            taskForm.addEventListener('submit', (e) => this.handleCreateTask(e));
        } else {
            console.error('Create task form NOT FOUND!');
        }
    }

    initManageTasks() {
        console.log('Loading tasks...');
        this.loadTasks();
        
        // Initialize filter event listeners
        const applyFiltersBtn = document.getElementById('applyFilters');
        if (applyFiltersBtn) {
            applyFiltersBtn.addEventListener('click', () => this.applyFilters());
        }
        
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('keyup', (e) => {
                if (e.key === 'Enter') this.applyFilters();
            });
        }
        
        // Initialize edit modal save button
        const saveEditBtn = document.getElementById('saveEditBtn');
        if (saveEditBtn) {
            saveEditBtn.addEventListener('click', () => this.handleEditTask());
        }
    }

    async handleCreateTask(e) {
        e.preventDefault();
        console.log('Create task form submitted');
        
        const taskData = {
            title: document.getElementById('title').value,
            description: document.getElementById('description').value,
            status: document.getElementById('status').value,
            priority: document.getElementById('priority').value,
            due_date: document.getElementById('due_date').value || null
        };

        console.log('Task data to submit:', taskData);

        try {
            const response = await fetch(`${API_BASE_URL}/tasks`, {
                method: 'POST',
                headers: this.auth.getAuthHeader(),
                body: JSON.stringify(taskData)
            });

            console.log('Create task response status:', response.status);
            const data = await response.json();
            console.log('Create task response data:', data);

            if (response.ok) {
                this.showMessage('Task created successfully!', 'success');
                document.getElementById('taskForm').reset();
                // Redirect immediately without delay
                window.location.href = 'manage-tasks.html';
            } else {
                console.error('Failed to create task:', data.error);
                this.showMessage(data.error || 'Failed to create task', 'danger');
            }
        } catch (error) {
            console.error('Create task error:', error);
            this.showMessage('An error occurred. Please try again.', 'danger');
        }
    }

    async loadTasks() {
        console.log('Loading tasks with filters:', this.currentFilters);
        try {
            const queryParams = new URLSearchParams(this.currentFilters).toString();
            const url = `${API_BASE_URL}/tasks${queryParams ? '?' + queryParams : ''}`;
            console.log('Fetching tasks from:', url);
            
            const response = await fetch(url, {
                headers: this.auth.getAuthHeader()
            });

            console.log('Load tasks response status:', response.status);
            
            if (response.status === 401) {
                console.error('Unauthorized - redirecting to login');
                this.auth.logout();
                return;
            }
            
            const data = await response.json();
            console.log('Load tasks response data:', data);

            if (response.ok) {
                this.renderTasks(data.tasks);
                this.updateStats(data.stats);
            } else {
                console.error('Failed to load tasks:', data.error);
            }
        } catch (error) {
            console.error('Load tasks error:', error);
            this.showMessage('Failed to load tasks. Please refresh the page.', 'danger');
        }
    }

    renderTasks(tasks) {
        console.log('Rendering tasks:', tasks);
        const tasksList = document.getElementById('tasksList');
        
        if (!tasksList) {
            console.error('tasksList element not found!');
            return;
        }
        
        if (!tasks || tasks.length === 0) {
            tasksList.innerHTML = `
                <div class="text-center py-5">
                    <h5>No tasks found</h5>
                    <p>Create your first task to get started!</p>
                    <a href="create-task.html" class="btn btn-primary">Create Task</a>
                </div>
            `;
            return;
        }

        let html = '';
        tasks.forEach(task => {
            // Format dates safely
            let dueDate = 'No due date';
            let createdDate = 'Unknown';
            
            try {
                if (task.due_date) {
                    dueDate = new Date(task.due_date).toLocaleDateString();
                }
                if (task.created_at) {
                    createdDate = new Date(task.created_at).toLocaleDateString();
                }
            } catch (e) {
                console.error('Error formatting dates:', e);
            }
            
            const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'completed';
            
            html += `
                <div class="card task-card mb-3 priority-${task.priority || 'medium'}">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start">
                            <div style="flex-grow: 1;">
                                <h5 class="card-title">${task.title || 'Untitled Task'}</h5>
                                <p class="card-text text-muted">${task.description || 'No description'}</p>
                                <div class="d-flex gap-2 mb-2">
                                    <span class="status-badge status-${task.status || 'pending'}">
                                        ${task.status || 'pending'}
                                    </span>
                                    <span class="badge bg-${task.priority === 'high' ? 'danger' : task.priority === 'medium' ? 'warning' : 'success'}">
                                        ${task.priority || 'medium'} priority
                                    </span>
                                    ${isOverdue ? '<span class="badge bg-danger">Overdue</span>' : ''}
                                </div>
                                <small class="text-muted">
                                    Created: ${createdDate} | Due: ${dueDate}
                                </small>
                            </div>
                            <div class="btn-group ms-3">
                                <button class="btn btn-sm btn-outline-primary" onclick="taskManager.editTask(${task.id})">
                                    Edit
                                </button>
                                <button class="btn btn-sm btn-outline-danger" onclick="taskManager.deleteTask(${task.id})">
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        tasksList.innerHTML = html;
    }

    updateStats(stats) {
        console.log('Updating stats:', stats);
        
        // Initialize with zeros
        const statsMap = {
            'pending': 0,
            'in-progress': 0,
            'completed': 0
        };

        let total = 0;
        
        if (stats && Array.isArray(stats)) {
            stats.forEach(stat => {
                statsMap[stat.status] = stat.count || 0;
                total += stat.count || 0;
            });
        }

        // Update DOM elements
        const totalEl = document.getElementById('totalTasks');
        const pendingEl = document.getElementById('pendingTasks');
        const progressEl = document.getElementById('progressTasks');
        const completedEl = document.getElementById('completedTasks');
        
        if (totalEl) totalEl.textContent = total;
        if (pendingEl) pendingEl.textContent = statsMap['pending'];
        if (progressEl) progressEl.textContent = statsMap['in-progress'];
        if (completedEl) completedEl.textContent = statsMap['completed'];
    }

    applyFilters() {
        console.log('Applying filters');
        this.currentFilters = {
            status: document.getElementById('statusFilter')?.value || '',
            priority: document.getElementById('priorityFilter')?.value || '',
            search: document.getElementById('searchInput')?.value || '',
            sortBy: document.getElementById('sortBy')?.value || '',
            sortOrder: 'ASC'
        };
        
        console.log('Current filters:', this.currentFilters);
        this.loadTasks();
    }

    async editTask(taskId) {
        console.log('Editing task:', taskId);
        try {
            const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
                headers: this.auth.getAuthHeader()
            });

            if (response.status === 401) {
                this.auth.logout();
                return;
            }

            const task = await response.json();
            console.log('Edit task response:', task);

            if (response.ok) {
                document.getElementById('editTaskId').value = task.id;
                document.getElementById('editTitle').value = task.title;
                document.getElementById('editDescription').value = task.description || '';
                document.getElementById('editStatus').value = task.status;
                document.getElementById('editPriority').value = task.priority;
                document.getElementById('editDueDate').value = task.due_date || '';
                
                const modal = new bootstrap.Modal(document.getElementById('editTaskModal'));
                modal.show();
            }
        } catch (error) {
            console.error('Edit task error:', error);
            this.showMessage('Failed to load task', 'danger');
        }
    }

    async handleEditTask() {
        const taskId = document.getElementById('editTaskId').value;
        const taskData = {
            title: document.getElementById('editTitle').value,
            description: document.getElementById('editDescription').value,
            status: document.getElementById('editStatus').value,
            priority: document.getElementById('editPriority').value,
            due_date: document.getElementById('editDueDate').value || null
        };

        console.log('Updating task:', taskId, 'with data:', taskData);

        try {
            const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
                method: 'PUT',
                headers: this.auth.getAuthHeader(),
                body: JSON.stringify(taskData)
            });

            const data = await response.json();
            console.log('Update task response:', data);

            if (response.ok) {
                const modal = bootstrap.Modal.getInstance(document.getElementById('editTaskModal'));
                if (modal) modal.hide();
                this.loadTasks();
                this.showMessage('Task updated successfully!', 'success');
            } else {
                this.showMessage(data.error || 'Failed to update task', 'danger');
            }
        } catch (error) {
            console.error('Update task error:', error);
            this.showMessage('An error occurred. Please try again.', 'danger');
        }
    }

    async deleteTask(taskId) {
        if (!confirm('Are you sure you want to delete this task?')) {
            return;
        }

        console.log('Deleting task:', taskId);

        try {
            const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
                method: 'DELETE',
                headers: this.auth.getAuthHeader()
            });

            const data = await response.json();
            console.log('Delete task response:', data);

            if (response.ok) {
                this.loadTasks();
                this.showMessage('Task deleted successfully!', 'success');
            } else {
                this.showMessage(data.error || 'Failed to delete task', 'danger');
            }
        } catch (error) {
            console.error('Delete task error:', error);
            this.showMessage('An error occurred. Please try again.', 'danger');
        }
    }

    showMessage(message, type) {
        console.log(`TaskManager: Showing message: ${message} (${type})`);
        const messageDiv = document.getElementById('message');
        if (messageDiv) {
            messageDiv.innerHTML = `
                <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                    ${message}
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                </div>
            `;
        }
    }
}

// Initialize task manager when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing TaskManager...');
    window.taskManager = new TaskManager();
});