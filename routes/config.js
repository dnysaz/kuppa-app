/**
 * Routing & Namespace Configuration - Kuppa Framework
 * Standardized for The minimalist javascript supabase framework
 */

const express = require('express');
const wrap = coreFile('utils.RouteWrapper');

const kuppa = {
    router: wrap(express.Router()),

    // --- Controller Namespace ---
    controllers: {
        web: {
            home:       appFile('Controllers.HomeController'),
            auth:       appFile('Controllers.AuthController'),
            profile:    appFile('Controllers.ProfileController'),
            socialAuth: appFile('Controllers.SocialAuthController'),
            dashboard:  appFile('Controllers.DashboardController'),
            blog:       appFile('Controllers.BlogController'),

            // add more ...
        },
        api: {
            // General API Controllers
            // post: appFile('Controllers.Api.PostController'),
        }
    },

    // --- Middleware Namespace ---
    middleware: {
        auth:    appFile('Middleware.AuthMiddleware'),
        guest:   appFile('Middleware.GuestMiddleware'),
        apiAuth: coreFile('middleware.ApiAuthMiddleware'),
        db:      coreFile('middleware.DatabaseFeatureMiddleware'),
        // add more ...
    }
};

module.exports = kuppa;