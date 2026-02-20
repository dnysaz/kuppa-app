/**
 * AuthMiddleware - Kuppa Framework
 */
module.exports = (req, res, next) => {
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