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

    // Titipkan di req (untuk diakses sebagai process.user)
    req.user = user; 
    
    // Pastikan res.locals juga tetap pegang data (untuk cadangan)
    res.locals.user = user;

    next();
};