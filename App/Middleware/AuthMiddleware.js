/**
 * AuthMiddleware - Kuppa Framework
 * FIXED: Added API bypass to prevent redirecting API calls
 */
module.exports = (req, res, next) => {

    if (req.originalUrl.startsWith('/api')) {
        return next();
    }

    const user = res.locals.user;

    if (!user) {
        const loginPath = global.KuppaRoutes ? global.KuppaRoutes['login'] : '/login';
        if (req.path === loginPath) return next();
        return res.redirect(loginPath);
    }

    req.user = user; 
    res.locals.user = user;

    next();
};