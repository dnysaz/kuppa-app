const express = require('express');
const wrap = require('../core/utils/RouteWrapper');

const kuppa = {
    // Core Router Instance
    router: wrap(express.Router()),

    // --- Controller Namespace ---
    // User can add their controllers here
    controllers: {
        web: {
            home: require('../app/Controllers/HomeController'),
            auth: require('../app/Controllers/AuthController'),
            SocialAuth: require('../app/Controllers/SocialAuthController'),
            dashboard: require('../app/Controllers/DashboardController'),
            // add others here  
        },
        api: {
            // General API Controllers
            // post: require('../app/Controllers/Api/PostController'),
        }
    },

    // --- Middleware Namespace ---
    middleware: {
        auth: require('../app/Middleware/AuthMiddleware'),
        guest: require('../app/Middleware/GuestMiddleware'),
        apiAuth: require('../app/Middleware/ApiAuthMiddleware'),
        db: require('../core/middleware/DatabaseFeatureMiddleware'),
    }
};

module.exports = kuppa;