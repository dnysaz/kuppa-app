const fx = require('./config');
const route = fx.router;

// Aliasing for cleaner code
const web = fx.controllers.web;
const mw = fx.middleware;

/**
 * Kuppa Web Routes Configuration
 * One Direction, One Goal
 */

// --- Public Routes ---
route.get('/', web.home.index).name('home');

// --- Auth Guest Group (Only accessible if NOT logged in) ---
route.group([mw.db, mw.guest], (route) => {
    route.get('/login', web.auth.loginPage).name('login');
    route.get('/register', web.auth.registerPage).name('register');
    
    route.post('/login', web.auth.login).name('login.post');
    route.post('/register', web.auth.register).name('register.post');
});

// --- Dashboard & Protected Group (Requires Authentication) ---
route.group([mw.db, mw.auth], (route) => {
    // Dashboard
    route.get('/dashboard', web.dashboard.index).name('dashboard');
    
    // Profile Management
    route.get('/dashboard/edit-profile', web.dashboard.edit).name('profile.edit');
    route.post('/dashboard/update-profile', web.dashboard.update).name('profile.update');
    route.get('/dashboard/update-password', web.dashboard.password).name('profile.password');
    route.post('/dashboard/update-password', web.dashboard.updatePassword).name('profile.password.update');
    
    // Session Management
    route.post('/logout', web.auth.logout).name('logout');
});

module.exports = route;