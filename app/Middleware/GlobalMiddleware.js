const { supabase } = require('../../core/config/Database');

/**
 * GlobalMiddleware - Kuppa Framework
 * Mendeteksi apakah avatar_url adalah link (Google) atau file (Upload)
 */
module.exports = async (req, res, next) => {
    const token = req.cookies.Kuppa_session;
    res.locals.user = null;
    res.locals.globalUser = null;

    if (token) {
        try {
            const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
            const userId = payload.sub || payload.id;
            
            const { data: dbUser } = await supabase
                .from('users')
                .select('*')
                .eq('id', userId)
                .single();

            if (dbUser) {
                let avatarUrl = dbUser.avatar_url;

                if (avatarUrl) {
                    if (!avatarUrl.startsWith('http')) {
                        avatarUrl = avatarUrl.startsWith('/uploads/') ? avatarUrl : `/uploads/${avatarUrl}`;
                    }
                }

                // 3. Set data untuk View Engine
                res.locals.user = dbUser;
                res.locals.globalUser = { 
                    name: dbUser.full_name || 'User', 
                    email: dbUser.email,
                    avatar: avatarUrl
                };
                
                req.user = dbUser;
            }
        } catch (err) {
            console.error('[Kuppa Middleware Error]:', err.message);
        }
    }
    next();
};