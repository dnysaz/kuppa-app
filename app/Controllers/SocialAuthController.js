/**
 * SocialAuthController - Kuppa Framework
 * Standardized Social Authentication Logic (OAuth)
 * Refactored for FINAL PRO Standard by Ketut Dana
 */

// Core System Dependencies
const BaseController = coreFile('controller.BaseController');
const { supabase }   = coreFile('config.Database');
const Session        = coreFile('auth.Session');

class SocialAuthController extends BaseController {

    /**
     * [GET] Redirect user to Google Login
     */
    async google(process) {
        const siteUrl           = global.process.env.APP_URL;
        const redirectPath      = `${siteUrl}/auth/callback`;
        const loginErrorPath    = '/login?error=';
        
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
            return process.res.redirect(loginErrorPath + encodedError);
        }

        return process.res.redirect(data.url);
    }

    /**
     * [GET] Handle the callback from Google/Supabase
     */
    async callback(process) {
        return process.view('auth.callback').with({ 
            layout: false   
        });
    }

    /**
     * [POST] Sync Social Session to Server
     * Crucial for RoleMiddleware to detect email from session
     */
    async syncSession(process) {
        const { email, access_token } = process.body;

        if (!email) {
            return process.res.status(400).json({ 
                status: 'failed', 
                message: 'Email is required' 
            });
        }

        // 1. Set Session Email untuk RoleMiddleware
        process.req.session.user_email = email;
        
        // 2. Gunakan Helper Session milik Kuppa
        Session.create(process.res, access_token);

        // 3. Return Success (RouteWrapper handles session persistence)
        return process.res.json({ status: 'success' });
    }
}

module.exports = SocialAuthController;