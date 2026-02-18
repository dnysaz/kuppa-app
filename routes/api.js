const fx = require('./config');
const route = fx.router;
const api = fx.controllers.api;
const mw = fx.middleware;

/**
 * Kuppa API Routes
 */
route.group([mw.db], (route) => {
    
    // Default API Versioning
    route.group({ prefix: '/v1' }, (route) => {
        
        // Example of a general resource routing
        // route.get('/resource', api.someController.index);
        
    });

});

module.exports = route;