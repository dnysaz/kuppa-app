const { supabase } = require('../../core/config/Database');
const BaseController = require('../../core/controller/BaseController');

/**
 * SocialAuthController - Kuppa Framework
 * Standardized Social Authentication Logic (OAuth)
 */
class SocialAuthController extends BaseController {

    /**
     * [GET] Redirect user to Google Login
     */
    static async google(process) {
        try {
            // Mengambil SITE_URL dari global process untuk menghindari shadowing
            const siteUrl = global.process.env.APP_URL;

            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${siteUrl}/auth/callback`,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'select_account',
                    },
                },
            });

            if (error) {
                console.error('[Kuppa Social Error]', error.message);
                return process.redirect('login?error=' + encodeURIComponent(error.message));
            }

            // Redirect user ke URL Google
            process.redirect(data.url);

        } catch (err) {
            console.error('[Kuppa Error]', err.message);
        }
        process.error;
    }

    /**
     * [GET] Handle the callback from Google/Supabase
     */
    static async callback(process) {
        try {
            // Kita tidak langsung redirect, tapi render view bridge
            return process.render('auth.callback', { 
                layout: false // Tidak butuh header/footer
            });
        } catch (err) {
            console.error('[Kuppa Error]', err.message);
            process.redirect('login');
        }
    }
}

module.exports = SocialAuthController;