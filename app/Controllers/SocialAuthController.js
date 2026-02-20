/**
 * SocialAuthController - Kuppa Framework
 * Standardized Social Authentication Logic (OAuth)
 */

// Core System Dependencies
const BaseController = coreFile('controller.BaseController');
const { supabase }   = coreFile('config.Database');

class SocialAuthController extends BaseController {

    /**
     * [GET] Redirect user to Google Login
     */
    static async google(process) {
        try {
            // Accessing APP_URL via global.process to avoid shadowing with the 'process' parameter
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
                return process.res.redirect('/login?error=' + encodeURIComponent(error.message));
            }

            return process.res.redirect(data.url);

        } catch (err) {
            process.next(err);
            return process.res.redirect('/login');
        }
    }

    /**
     * [GET] Handle the callback from Google/Supabase
     */
    static async callback(process) {
        try {
            // Render view bridge without layout using Fluent Interface
            return process.res.render('auth.callback').with({ 
                layout: false 
            });
        } catch (err) {
            process.next(err);
            return process.res.redirect('/login');
        }
    }
}

module.exports = SocialAuthController;