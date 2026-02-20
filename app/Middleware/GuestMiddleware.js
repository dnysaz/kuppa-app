/**
 * GuestMiddleware - Kuppa Framework
 */
module.exports = (req, res, next) => {
    const user = res.locals.user;

    if (user) {
        const dashboardPath = global.KuppaRoutes ? global.KuppaRoutes['dashboard'] : '/dashboard';
        
        const loginPath = global.KuppaRoutes ? global.KuppaRoutes['login'] : '/login';
        const registerPath = global.KuppaRoutes ? global.KuppaRoutes['register'] : '/register';

        if (req.path === loginPath || req.path === registerPath) {
            return res.redirect(dashboardPath);
        }
    }
    
    next();
};