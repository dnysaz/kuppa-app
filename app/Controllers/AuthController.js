/**
 * AuthController - Kuppa Framework
 * Standardized for The minimalist javascript supabase framework
 */

// Core System Dependencies
const BaseController = coreFile('controller.BaseController');
const { supabase }   = coreFile('config.Database');
const Session        = coreFile('auth.Session');

// Application Dependencies
const User           = appFile('Models.User');

class AuthController extends BaseController {
    
    /**
     * [GET] Display Login Page
     */
    static async loginPage(process) {
        try {
            const title = 'Login';
            const message = 'Please login to continue.';
            const layout = 'layouts.guest';

            return process.res.render('auth.login').with({ layout, title, message });

        } catch (err) {
            // Forward to exception handler
            process.next(err);
        }
    }

    /**
     * [GET] Display Register Page
     */
    static async registerPage(process) {
        try {
            const title = 'Register';
            const message = 'Create a new account.';
            const layout = 'layouts.guest';

            return process.res.render('auth.register').with({ layout, title, message });
                
        } catch (err) {
            // Forward to exception handler
            process.next(err);
        }
    }

    /**
     * [POST] Process Registration
     */
    static async register(process) {
        try {
            const { name, email, password, password_confirmation } = process.body;
            const title = 'Register';
            const layout = 'layouts.guest';

            // 1. Validation Logic
            if (!name || !email || !password) {
                 return process.res.render('auth.register').with({ 
                    layout, 
                    title, 
                    errorMessage: 'All fields are required.', 
                    oldData: { name, email } 
                });
            }

            if (password !== password_confirmation) {
                return process.res.render('auth.register').with({ 
                    layout, 
                    title, 
                    errorMessage: 'Password confirmation does not match.', 
                    oldData: { name, email } 
                });
            }

            // 2. Supabase Auth SignUp
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: { data: { full_name: name } }
            });

            if (error) {
                return process.res.render('auth.register').with({ 
                    layout, 
                    title, 
                    errorMessage: error.message, 
                    oldData: { name, email } 
                });
            }

            return process.res.render('auth.login').with({ 
                layout, 
                title: 'Login', 
                message: 'Registration successful! You can now login.' 
            });

        } catch (err) {
            // Forward to exception handler
            process.next(err);
        }
    }

    /**
     * [POST] Process Login
     */
    static async login(process) {
        try {
            const { email, password } = process.body;
            const title = 'Login';
            const layout = 'layouts.guest';

            // Validate empty input
            if (!email || !password) {
                return process.res.render('auth.login').with({ 
                    layout, 
                    title, 
                    errorMessage: 'Email and password are required.', 
                    oldEmail: email 
                });
            }

            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) {
                return process.res.render('auth.login').with({ 
                    layout, 
                    title, 
                    errorMessage: error.message, 
                    oldEmail: email 
                });
            }

            // Sync session to SDK state
            await supabase.auth.setSession({
                access_token: data.session.access_token,
                refresh_token: data.session.refresh_token
            });

            // Save Session using Core Session Helper
            Session.create(process.res, data.session.access_token);

            return process.res.redirect('/dashboard');

        } catch (err) {
            // Forward to exception handler
            process.next(err);
            if (!process.res.headersSent) {
                return process.res.redirect('/login');
            }
        }
    }

    /**
     * [POST] Process Logout
     */
    static async logout(process) {
        try {
            // Sign out from Supabase SDK
            await supabase.auth.signOut(); 
            
            // Destroy session cookie via Core Session Helper
            Session.destroy(process.res); 

            return process.res.redirect('/login');
        } catch (err) {
            // Ensure cookie is cleared even if SDK signout fails
            process.next(err);
            Session.destroy(process.res); 
            return process.res.redirect('/login');
        }
    }
}

module.exports = AuthController;