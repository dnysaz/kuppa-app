/**
 * Kuppa API Routes Configuration
 * Updated: Using Array Syntax for Instance-based Controllers
 * Optimized by Ketut Dana
 */

const kuppa = require('./config');
const route = kuppa.router;
const api   = kuppa.controllers.api;
const mw    = kuppa.middleware;

/**
 * Kuppa API Routes
 */
route.group([mw.db], (route) => {
    
    // Default API Versioning
    route.group({ prefix: '/v1' }, (route) => {
        
        // Example of a general resource routing using Instance Method
        // route.get('/resource', [api.someController, 'index']).name('api.v1.resource');
        
        // Example of protected API route
        // route.get('/user', [api.userController, 'show'], [mw.apiAuth]);
        
    });

});

module.exports = route;