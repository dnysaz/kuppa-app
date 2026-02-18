const { supabase } = require('../../core/config/Database');
const User = require('../Models/User');
const BaseController = require('../../core/controller/BaseController');


/**
 * AuthController - Kuppa Framework
 * Standardized Authentication Logic
 */
class AuthController extends BaseController {
    
    /**
     * [GET] Display Login Page
     */
    static async loginPage(process) {
        try {
            process.render('auth.login', { 
                layout: 'layouts.guest',
                title: 'Login', 
                message: 'Please login to continue.' 
            });
        } catch (err) {
            console.error('[Kuppa Error]', err.message);
        }
        process.error;
    }

    /**
     * [GET] Display Register Page
     */
    static async registerPage(process) {
        try {
            process.render('auth.register', { 
                layout: 'layouts.guest',
                title: 'Register', 
                message: 'Create a new account.' 
            });
        } catch (err) {
            console.error('[Kuppa Error]', err.message);
        }
        process.error;
    }

    /**
     * [POST] Process Registration
     */
    static async register(process) {
        try {
            const { name, email, password, password_confirmation } = process.body;

            // 1. Validation Logic
            if (!name || !email || !password) {
                 return process.render('auth.register', {
                    layout: 'layouts.guest',
                    title: 'Register',
                    errorMessage: 'All fields are required.',
                    oldData: { name, email }
                });
            }

            if (password !== password_confirmation) {
                return process.render('auth.register', {
                    layout: 'layouts.guest',
                    title: 'Register',
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
                return process.render('auth.register', {
                    layout: 'layouts.guest',
                    title: 'Register',
                    errorMessage: error.message,
                    oldData: { name, email }
                });
            }

            process.render('auth.login', {
                layout: 'layouts.guest',
                title: 'Login',
                message: 'Registration successful! Please check your email for confirmation.'
            });

        } catch (err) {
            console.error('[Kuppa Error]', err.message);
        }
        process.error;
    }

    /**
     * [POST] Process Login
     */
    static async login(process) {
        try {
            const { email, password } = process.body;

            // Validate empty input
            if (!email || !password) {
                return process.render('auth.login', {
                    layout: 'layouts.guest',
                    title: 'Login',
                    errorMessage: 'Email and password are required.',
                    oldEmail: email
                });
            }

            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) {
                return process.render('auth.login', {
                    layout: 'layouts.guest',
                    title: 'Login',
                    errorMessage: error.message,
                    oldEmail: email
                });
            }

            // Get production status from global environment
            const isProduction = global.process.env.APP_DEBUG === 'false';

            // Save Session to Secure Cookie
            process.res.cookie('Kuppa_session', data.session.access_token, {
                httpOnly: true, 
                secure: isProduction,
                sameSite: 'lax',
                maxAge: 60 * 60 * 1000 // 1 Hour
            });

            process.redirect('dashboard');

        } catch (err) {
            console.error('[Kuppa Error]', err.message);
        }
        process.error;
    }

    /**
     * [POST] Process Logout
     */
    static async logout(process) {
        try {
            await supabase.auth.signOut(); 
            process.res.clearCookie('Kuppa_session'); 
            process.redirect('login');
        } catch (err) {
            console.error('[Kuppa Error]', err.message);
            process.res.clearCookie('Kuppa_session'); 
            process.redirect('login');
        }
        process.error;
    }
}

module.exports = AuthController;