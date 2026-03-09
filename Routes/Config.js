/**
 * Routing & Namespace Configuration - Kuppa Framework
 * Standardized for The minimalist javascript supabase framework
 */

const express = require('express');
const wrap    = coreFile('Utils.RouteWrapper');

const kuppa = {
    
    createRouter: () => wrap(express.Router()),

    // --- Controller Namespace ---
    controllers: {
        web: {
            home:       appFile('Controllers.HomeController'),
            auth:       appFile('Controllers.AuthController'),
            profile:    appFile('Controllers.ProfileController'),
            socialAuth: appFile('Controllers.SocialAuthController'),
            dashboard:  appFile('Controllers.DashboardController'),
            admin:      appFile('Controllers.AdminController')

            // add more ...
        },
        api: {

            // General API Controllers
            
        }
    },

    // --- Middleware Namespace ---
    middleware: {
        auth:    appFile('Middleware.AuthMiddleware'),
        guest:   appFile('Middleware.GuestMiddleware'),
        apiAuth: coreFile('Middleware.ApiAuthMiddleware'),
        db:      coreFile('Middleware.DatabaseFeatureMiddleware'),
        role:    coreFile('Middleware.RoleMiddleware')
        // add more ...
    }
};

module.exports = kuppa;