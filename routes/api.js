const kuppa = require('./config');
const route = kuppa.router;
const api = kuppa.controllers.api;
const mw = kuppa.middleware;

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