const { supabase } = require('../../core/config/Database');

/**
 * GlobalMiddleware - Kuppa Framework
 * Menjaga data user tetap sinkron antara Session dan Database
 */
module.exports = async (req, res, next) => {
    const token = req.cookies.Kuppa_session;
    res.locals.user = null;
    res.locals.globalUser = null;

    if (token) {
        try {
            // 1. Decode Payload JWT
            const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
            const userId = payload.sub || payload.id;
            
            // 2. Sync dengan Database
            const { data: dbUser } = await supabase
                .from('users')
                .select('*')
                .eq('id', userId)
                .single();

            // 3. Merge Data: Prioritaskan data Database (untuk mendapatkan avatar_url terbaru)
            const mergedUser = dbUser ? { ...payload, ...dbUser } : payload;
            
            // Simpan ke locals untuk View Engine
            res.locals.user = mergedUser;
            res.locals.globalUser = { 
                name: mergedUser.full_name || mergedUser.user_metadata?.full_name || 'User', 
                email: mergedUser.email,
                // MAPPING PENTING: Agar Navbar bisa akses {{globalUser.avatar}}
                avatar: mergedUser.avatar_url 
            };
            
            // Simpan ke req agar bisa diakses Controller sebagai process.user
            req.user = mergedUser;

        } catch (err) {
            // Jika token corrupt
            console.error('[Kuppa Middleware Error]:', err.message);
        }
    }
    next();
};