const API_BASE_URL = '/api';

// Utility format currency
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
    }).format(amount);
};

// Check Auth State
const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
};

const getUser = () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
};

// Common fetch wrap to include Auth token automatically
const authFetch = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const url = endpoint.startsWith(API_BASE_URL) ? endpoint : `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
        ...options,
        headers
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
    }

    return data;
};

// Handle Navbar Auth State UI update
document.addEventListener('DOMContentLoaded', () => {
    const navAuthArea = document.getElementById('nav-auth-area');
    if (navAuthArea) {
        if (isAuthenticated()) {
            const user = getUser();
            navAuthArea.innerHTML = `
                <li class="nav-item">
                    <span class="nav-link fw-semibold text-primary">Hi, ${user.fullName}</span>
                </li>
                <li class="nav-item ms-lg-3">
                    <button class="btn btn-outline-danger" onclick="logout()">Logout</button>
                </li>
            `;
        } else {
            navAuthArea.innerHTML = `
                <li class="nav-item ms-lg-3"><a class="btn btn-outline-dark me-2" href="login.html">Login</a></li>
                <li class="nav-item"><a class="btn btn-primary" href="register.html">Register</a></li>
            `;
        }
    }
});

const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
};
