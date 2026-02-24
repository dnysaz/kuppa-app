/**
 * Kuppa Web Routes Configuration
 */

const kuppa = require('./config');
const route = kuppa.router;
const web   = kuppa.controllers.web;
const mw    = kuppa.middleware;

// --- 1. Public Routes ---
route.get('/', web.home.index).name('home');
route.get('/help', web.home.help).name('help');
route.get('/blog', web.blog.index).name('blog');

// --- 2. Auth Guest Group (Only accessible if NOT logged in) ---
route.group([mw.guest], (route) => {
    // Login & Register Pages
    route.get('/login',   web.auth.loginPage).name('login');
    route.get('/register',web.auth.registerPage).name('register');
    
    // Auth Processing
    route.post('/login',   web.auth.login).name('login.post');
    route.post('/register',web.auth.register).name('register.post');

    // Forgot & Reset Password
    route.get('/forgot-password', web.auth.forgotPassword).name('password.request');
    route.post('/forgot-password',web.auth.sendResetLink).name('password.email');
    route.get('/reset-password',  web.auth.resetPassword).name('password.reset');
    route.post('/reset-password', web.auth.updatePassword).name('password.update');

    // Social Authentication
    route.get('/auth/google',  web.socialAuth.google).name('google.login');
    route.get('/auth/callback',web.socialAuth.callback).name('google.login.callback');
});

// --- 3. Dashboard & Protected Group (Requires Authentication) ---
route.group([mw.auth], (route) => {
    // Main Dashboard
    route.get('/dashboard', web.dashboard.index).name('dashboard');
    
    // Profile Management
    route.get('/profile/edit-profile',    web.profile.edit).name('profile.edit');
    route.post('/profile/update-profile', web.profile.update).name('profile.update');
    route.get('/profile/update-password', web.profile.password).name('profile.password');
    route.post('/profile/update-password',web.profile.updatePassword).name('profile.password.update');
    
    // Authentication Session Management
    route.post('/logout', web.auth.logout).name('logout');
});

module.exports = route;