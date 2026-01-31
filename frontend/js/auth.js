const API_BASE_URL = 'http://localhost:3000/api';

class Auth {
    constructor() {
        this.token = localStorage.getItem('token');
        this.user = JSON.parse(localStorage.getItem('user'));
        console.log('Auth initialized. Token:', this.token ? 'Present' : 'Missing');
        console.log('User:', this.user);
        this.init();
    }

    init() {
        console.log('Auth init called. Current page:', window.location.pathname);
        
        // Check authentication on protected pages
        if (window.location.pathname.includes('create-task.html') || 
            window.location.pathname.includes('manage-tasks.html')) {
            console.log('Protected page detected, checking auth...');
            this.checkAuth();
        }

        // Initialize logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }

        // Initialize login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            console.log('Login form found, adding listener');
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Initialize register form
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            console.log('Register form found, adding listener');
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        console.log('Login form submitted');
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        console.log('Attempting login with email:', email);

        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            console.log('Login response status:', response.status);
            const data = await response.json();
            console.log('Login response data:', data);

            if (response.ok) {
                this.token = data.token;
                this.user = data.user;
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                console.log('Login successful, redirecting...');
                window.location.href = 'manage-tasks.html';
            } else {
                console.error('Login failed:', data.error);
                this.showMessage(data.error || 'Login failed', 'danger');
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showMessage('An error occurred. Please try again.', 'danger');
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        console.log('Register form submitted');
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            this.showMessage('Passwords do not match', 'danger');
            return;
        }

        console.log('Attempting registration with:', { username, email });

        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });

            console.log('Register response status:', response.status);
            const data = await response.json();
            console.log('Register response data:', data);

            if (response.ok) {
                this.showMessage('Registration successful! Redirecting to login...', 'success');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            } else {
                console.error('Registration failed:', data.error);
                this.showMessage(data.error || 'Registration failed', 'danger');
            }
        } catch (error) {
            console.error('Registration error:', error);
            this.showMessage('An error occurred. Please try again.', 'danger');
        }
    }

    checkAuth() {
        console.log('Checking authentication...');
        console.log('Token:', this.token);
        if (!this.token) {
            console.log('No token found, redirecting to login');
            window.location.href = 'login.html';
        } else {
            console.log('Authentication valid');
        }
    }

    logout() {
        console.log('Logging out...');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.token = null;
        this.user = null;
        window.location.href = '../../index.html';
    }

    getAuthHeader() {
        const headers = {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
        };
        console.log('Auth headers:', headers);
        return headers;
    }

    showMessage(message, type) {
        console.log(`Showing message: ${message} (${type})`);
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

// Initialize auth
console.log('Initializing Auth...');
const auth = new Auth();