/**
 * Kuppa Web Routes Configuration
 * One Direction, One Goal - Optimized by Ketut Dana
 */

const kuppa = require('./config');
const route = kuppa.router;
const web   = kuppa.controllers.web;
const mw    = kuppa.middleware;

// --- 1. Public Routes ---
route.get('/', web.home.index).name('home');

// --- 2. Auth Guest Group (Only accessible if NOT logged in) ---
route.group([mw.guest], (route) => {
    // Login & Register Pages
    route.get('/login',    web.auth.loginPage).name('login');
    route.get('/register', web.auth.registerPage).name('register');
    
    // Auth Processing
    route.post('/login',    web.auth.login).name('login.post');
    route.post('/register', web.auth.register).name('register.post');

    // Social Authentication
    route.get('/auth/google',   web.SocialAuth.google).name('google.login');
    route.get('/auth/callback', web.SocialAuth.callback).name('google.login.callback');
});

// --- 3. Dashboard & Protected Group (Requires Authentication) ---
route.group([mw.auth], (route) => {
    // Main Dashboard
    route.get('/dashboard', web.dashboard.index).name('dashboard');
    
    // Profile Management
    route.get('/dashboard/edit-profile',    web.dashboard.edit).name('profile.edit');
    route.post('/dashboard/update-profile',  web.dashboard.update).name('profile.update');
    route.get('/dashboard/update-password', web.dashboard.password).name('profile.password');
    route.post('/dashboard/update-password', web.dashboard.updatePassword).name('profile.password.update');
    
    // Authentication Session Management
    route.post('/logout', web.auth.logout).name('logout');
});

module.exports = route;