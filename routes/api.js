/**
 * Kuppa API Routes Configuration
 * Updated: Using Array Syntax for Instance-based Controllers
 * Optimized by Ketut Dana
 */

const kuppa = require('./config');
const route = kuppa.router;
const api   = kuppa.controllers.api;

/**
 * Kuppa API Routes
 */
route.get('/test', [api.test, 'index']).name('api.test');

module.exports = route;