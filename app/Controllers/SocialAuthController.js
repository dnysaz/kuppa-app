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
            // Context & Configurations
            const siteUrl           = global.process.env.APP_URL;
            const redirectPath      = `${siteUrl}/auth/callback`;
            const loginErrorPath    = '/login?error=';
            
            // Execute OAuth Sign-In
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: redirectPath,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'select_account',
                    },
                },
            });

            if (error) {
                const encodedError = encodeURIComponent(error.message);
                console.error('[Kuppa Social Error]', error.message);
                return process.res.redirect(loginErrorPath + encodedError);
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
            // Layout context
            const useLayout = false;

            // Render view bridge without layout using Fluent Interface
            return process.view('auth.callback').with({ 
                layout: useLayout 
            });
        } catch (err) {
            process.next(err);
            return process.res.redirect('/login');
        }
    }
}

module.exports = SocialAuthController;