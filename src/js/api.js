/**
 * Premium Clinic - Data Persistence & API Service
 * 
 * This module acts as the authoritative source of truth for the application.
 * It uses localStorage as a persistent data store to simulate a production backend.
 * All functions return Promises to maintain a production-ready async interface.
 */

const DB_KEYS = {
    USERS: 'clinic_v1_users',
    BOOKINGS: 'clinic_v1_bookings',
    QUERIES: 'clinic_v1_queries',
    SESSION: 'clinic_v1_session'
};

const StorageService = {
    // Initialization
    _init() {
        if (!localStorage.getItem(DB_KEYS.USERS)) localStorage.setItem(DB_KEYS.USERS, JSON.stringify([]));
        if (!localStorage.getItem(DB_KEYS.BOOKINGS)) localStorage.setItem(DB_KEYS.BOOKINGS, JSON.stringify([]));
        if (!localStorage.getItem(DB_KEYS.QUERIES)) localStorage.setItem(DB_KEYS.QUERIES, JSON.stringify([]));

        // Seed Admin User
        const users = JSON.parse(localStorage.getItem(DB_KEYS.USERS));
        const adminExists = users.some(u => u.email === 'admin@gmail.com');
        if (!adminExists) {
            users.push({
                id: 'ADM-MASTER',
                name: 'System Admin',
                email: 'admin@gmail.com',
                password: 'admin123',
                role: 'admin',
                createdAt: new Date().toISOString()
            });
            localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
        }
    },

    // --- User Management ---
    async getUsers() {
        return JSON.parse(localStorage.getItem(DB_KEYS.USERS) || '[]');
    },

    async registerUser(userData) {
        const users = await this.getUsers();

        // Prevent duplicate emails
        if (users.some(u => u.email === userData.email)) {
            throw new Error('User already exists');
        }

        const newUser = {
            id: 'USR-' + Date.now(),
            ...userData,
            role: 'user', // Always default to user
            createdAt: new Date().toISOString()
        };
        users.push(newUser);
        localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
        return newUser;
    },

    async login(email, password) {
        const users = await this.getUsers();
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            localStorage.setItem(DB_KEYS.SESSION, JSON.stringify(user));
            return user;
        }
        throw new Error('Invalid credentials');
    },

    async getCurrentUser() {
        const session = localStorage.getItem(DB_KEYS.SESSION);
        return session ? JSON.parse(session) : null;
    },

    async logout() {
        localStorage.removeItem(DB_KEYS.SESSION);
    },

    // --- Booking Management ---
    async getBookings() {
        return JSON.parse(localStorage.getItem(DB_KEYS.BOOKINGS) || '[]');
    },

    async createBooking(bookingData) {
        const currentUser = await this.getCurrentUser();
        const bookings = await this.getBookings();
        const newBooking = {
            id: 'BOK-' + Date.now(),
            userId: currentUser ? currentUser.id : 'GUEST',
            ...bookingData,
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        bookings.push(newBooking);
        localStorage.setItem(DB_KEYS.BOOKINGS, JSON.stringify(bookings));
        return newBooking;
    },

    async getUserBookings(userId) {
        const bookings = await this.getBookings();
        return bookings.filter(b => b.userId === userId);
    },

    // --- Query / Contact Management ---
    async getQueries() {
        return JSON.parse(localStorage.getItem(DB_KEYS.QUERIES) || '[]');
    },

    async submitQuery(queryData) {
        const queries = await this.getQueries();
        const newQuery = {
            id: 'QRY-' + Date.now(),
            ...queryData,
            createdAt: new Date().toISOString()
        };
        queries.push(newQuery);
        localStorage.setItem(DB_KEYS.QUERIES, JSON.stringify(queries));
        return newQuery;
    },

    // --- Analytics ---
    async getGlobalStats() {
        const users = await this.getUsers();
        const bookings = await this.getBookings();
        const queries = await this.getQueries();

        return {
            totalUsers: users.length,
            totalBookings: bookings.length,
            pendingBookings: bookings.filter(b => b.status === 'pending').length,
            totalQueries: queries.length,
            recentActivity: [...bookings, ...queries, ...users]
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 10)
        };
    }
};

// Auto-init
StorageService._init();
window.StorageService = StorageService;
