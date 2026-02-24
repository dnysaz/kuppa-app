/**
 * AuthController - Kuppa Framework
 * Standardized for The minimalist javascript supabase framework
 * Refactored with Skinny Controller Pattern by Ketut Dana
 */

// Core System Dependencies
const BaseController = coreFile('controller.BaseController');
const { supabase }   = coreFile('config.Database');
const Session        = coreFile('auth.Session');
const Validation     = coreFile('utils.Validation');
const Profile        = appFile('Models.Profile');

class AuthController extends BaseController {
    
    /**
     * [GET] Display Login Page
     */
    static async loginPage(process) {
        try {
            const layout      = 'layouts.guest';
            const title       = 'Login';
            const description = 'Please login to continue.';

            return process.view('auth.login').with({ 
                layout,
                title, 
                description 
            });
        } catch (err) {
            process.next(err);
        }
    }

    /**
     * [GET] Display Register Page
     */
    static async registerPage(process) {
        try {
            const layout      = 'layouts.guest';
            const title       = 'Register';
            const description = 'Create a new account.';

            return process.view('auth.register').with({
                layout,
                title,
                description 
            });
        } catch (err) {
            process.next(err);
        }
    }

    /**
     * [POST] Process Registration
     */
    static async register(process) {
        // Destructuring body for cleaner access
        const { name, email, password } = process.body;
        
        try {
            const layout = 'layouts.guest';
            const title  = 'Login';
            const message = 'Registration successful! You can now login.';

            // 1. Validation Logic
            const rules = {
                name: 'required|min:3',
                email: 'required|email',
                password: 'required|min:6|confirmed'
            };

            const validate = Validation.make(process.body, rules);

            if (validate.fails()) {
                return process.view('auth.register').with({ 
                    layout, 
                    errorMessage: validate.firstError(), 
                    oldData: { name, email } 
                });
            }

            /**
             * 2. Delegate to Profile Model
             * This triggers Supabase Auth and our PG Trigger syncs to 'profiles' table.
             */
            await Profile.createAccount(name, email, password);

            return process.view('auth.login').with({ layout, title, message });

        } catch (err) {
            // Serious mode: log error and return to view with message
            console.error('[Registration Error]', err.message);
            return process.view('auth.register').with({ 
                layout: 'layouts.guest', 
                errorMessage: err.message, 
                oldData: { name, email } 
            });
        }
    }

    /**
     * [POST] Process Login
     */
    static async login(process) {
        const { email, password } = process.body;
        
        try {
            const layout = 'layouts.guest';

            // 1. Validation Logic
            const validate = Validation.make(process.body, {
                email: 'required|email',
                password: 'required'
            });

            if (validate.fails()) {
                return process.view('auth.login').with({ 
                    layout, 
                    errorMessage: validate.firstError(), 
                    oldEmail: email 
                });
            }

            /**
             * 2. Attempt Login via Profile Model
             * Accessing instance methods since Profile is exported as 'new Profile()'
             */
            const session = await Profile.attemptLogin(email, password);

            // 3. Create Kuppa Session (Cookie persistence)
            Session.create(process.res, session.access_token);

            return process.res.redirect('/dashboard');

        } catch (err) {
            console.error('[Login Error]', err.message);
            return process.view('auth.login').with({ 
                layout: 'layouts.guest', 
                errorMessage: err.message, 
                oldEmail: email 
            });
        }
    }

    /**
     * [POST] Process Logout
     */
    static async logout(process) {
        
        try {
            await supabase.auth.signOut(); 
            Session.destroy(process.res); 
            return process.res.redirect('/login');
        } catch (err) {
            Session.destroy(process.res); 
            return process.res.redirect('/login');
        }
    }

    /**
     * [GET] Display Forgot Password Page
     */
    static async forgotPassword(process) {
        try {
            const layout       = 'layouts.guest';
            const title        = 'Forgot Password';
            const description  = 'Enter your new password to regain access to your account.';

            return process.view('auth.forgot-password').with({
                layout, 
                title,
                description,
            });

        } catch (err) {
            process.next(err);
        }
    }

    /**
     * [POST] Send Password Reset Link
     */
    static async sendResetLink(process) {
        try {
            const { email } = process.body;
            const layout    = 'layouts.guest';
            const message   = 'Password reset link has been sent to your email.';
            
            const validate = Validation.make(process.body, { email: 'required|email' });

            if (validate.fails()) {
                return process.view('auth.forgot-password').with({ 
                    layout, 
                    errorMessage: validate.firstError()
                });
            }

            const resetRedirect = `${process.req.protocol}://${process.req.get('host')}/reset-password`;

            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: resetRedirect,
            });

            if (error) {
                return process.view('auth.forgot-password').with({ 
                    layout, 
                    errorMessage: error.message 
                });
            }

            return process.view('auth.forgot-password').with({ layout, message });

        } catch (err) {
            process.next(err);
        }
    }

    /**
     * [GET] Display Reset Password Page
     */
    static async resetPassword(process) {
        try {
            const { access_token } = process.req.query;
            const layout = 'layouts.guest';
            const title  = 'Reset Password';
            const description  = 'Enter your new password to regain access to your account.';
            
            if (access_token) {
                await supabase.auth.setSession({
                    access_token: access_token,
                    refresh_token: ''
                });
                Session.create(process.res, access_token);
            }

            return process.view('auth.reset-password').with({
                layout,
                title,
                description
            });
        } catch (err) {
            process.next(err);
        }
    }

    /**
     * [POST] Process Password Update
     */
    static async updatePassword(process) {
        try {
            const layout  = 'layouts.guest';
            const title   = 'Login';
            const message = 'Password has been updated. You can now login.';
            const expired = 'Session expired. Please request a new reset link.';

            const validate = Validation.make(process.body, { 
                password: 'required|min:6|confirmed' 
            });

            if (validate.fails()) {
                return process.view('auth.reset-password').with({ 
                    layout, 
                    errorMessage: validate.firstError()
                });
            }

            const token = process.req.cookies.Kuppa_session;
            if (!token) {
                return process.view('auth.reset-password').with({ 
                    layout, 
                    errorMessage: expired
                });
            }

            await supabase.auth.setSession({ access_token: token, refresh_token: '' });
            const { error } = await supabase.auth.updateUser({ password: process.body.password });

            if (error) {
                return process.view('auth.reset-password').with({ 
                    layout, 
                    errorMessage: error.message 
                });
            }

            Session.destroy(process.res);

            return process.view('auth.login').with({ layout, title, message });

        } catch (err) {
            process.next(err);
        }
    }
}

module.exports = AuthController;