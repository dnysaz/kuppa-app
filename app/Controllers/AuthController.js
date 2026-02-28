/**
 * AuthController - Kuppa Framework
 * Standardized for KUPPA ORM - FINAL PRO (Stateless & Static)
 * Optimized for Flash, Session & Provider Security by Ketut Dana
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
    async loginPage(process) {
        return process.view('auth.login').with({ 
            layout: 'layouts.guest',
            title: 'Login', 
            description: 'Please login to continue.' 
        });
    }

    /**
     * [GET] Display Register Page
     */
    async registerPage(process) {
        return process.view('auth.register').with({
            layout: 'layouts.guest',
            title: 'Register',
            description: 'Create a new account.' 
        });
    }

    /**
     * [POST] Process Registration
     */
    async register(process) {
        try {
            // 1. Validation
            const validate = Validation.make(process.body, {
                name: 'required|min:3',
                email: 'required|email',
                password: 'required|min:6|confirmed'
            });

            if (validate.fails()) {
                return process.res.flash('error', validate.firstError())
                                  .withInput(process.body)
                                  .back();
            }

            // 2. Delegate to Static Model (FINAL PRO Standard)
            await Profile.createAccount(process.body.name, process.body.email, process.body.password);

            return process.res.flash('success', 'Registration successful! You can now login.')
                              .toRoute('login'); // Using named route for better handling

        } catch (err) {
            return process.res.flash('error', err.message)
                              .withInput(process.body)
                              .back();
        }
    }

    /**
     * [POST] Process Login
     */
    async login(process) {
        try {
            const validate = Validation.make(process.body, {
                email: 'required|email',
                password: 'required'
            });

            if (validate.fails()) {
                return process.res.flash('error', validate.firstError())
                                  .withInput(process.body)
                                  .back();
            }

            // Call static method from Profile model
            const sessionData = await Profile.attemptLogin(process.body.email, process.body.password);
            
            // Sync Session
            Session.create(process.res, sessionData.access_token);
            process.req.session.user_email = process.body.email;

            return process.res.flash('success', 'Welcome back!')
                              .toRoute('dashboard');

        } catch (err) {
            return process.res.flash('error', err.message)
                              .withInput(process.body)
                              .back();
        }
    }

    /**
     * [POST] Process Logout
     */
    async logout(process) {
        await supabase.auth.signOut(); 
        Session.destroy(process.res); 
        return process.res.redirect('/login');
    }

    /**
     * [GET] Display Forgot Password Page
     */
    async forgotPassword(process) {
        return process.view('auth.forgot-password').with({
            layout: 'layouts.guest', 
            title: 'Forgot Password',
            description: 'Enter your email to regain access.',
        });
    }

    /**
     * [POST] Send Password Reset Link
     */
    async sendResetLink(process) {
        try {
            const { email } = process.body;

            const validate = Validation.make(process.body, { email: 'required|email' });

            if (validate.fails()) {
                return process.res.flash('error', validate.firstError())
                                  .withInput(process.body)
                                  .back();
            }

            // 2. Cek database via Static Model (Basemodel PRO)
            const userProfile = await Profile.findByEmail(email);

            if (!userProfile) {
                return process.res.flash('error', 'We couldn\'t find an account with that email address.')
                                  .withInput(process.body)
                                  .back();
            }

            // 3. Provider Security Check
            const provider = userProfile.provider || 'email';
            if (provider !== 'email') {
                return process.res.flash('error', `This account is linked with ${provider.toUpperCase()}. Please sign in using your social account.`)
                                  .withInput(process.body)
                                  .back();
            }

            // 4. Supabase Reset Logic
            const resetRedirect = `${process.req.protocol}://${process.req.get('host')}/reset-password`;
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, { 
                redirectTo: resetRedirect 
            });

            if (resetError) {
                return process.res.flash('error', resetError.message).back();
            }

            return process.res.flash('success', 'Password reset link has been sent to your email.').back();

        } catch (err) {
            console.error('[Reset Link Error]:', err.message);
            return process.res.flash('error', 'An unexpected error occurred.').back();
        }
    }

    /**
     * [GET] Display Reset Password Page
     */
    async resetPassword(process) {
        const { access_token } = process.req.query;
        
        if (access_token) {
            await supabase.auth.setSession({ access_token, refresh_token: '' });
            Session.create(process.res, access_token);
        }

        return process.view('auth.reset-password').with({
            layout: 'layouts.guest',
            title: 'Reset Password',
            description: 'Enter your new password.'
        });
    }

    /**
     * [POST] Process Password Update
     */
    async updatePassword(process) {
        try {
            const validate = Validation.make(process.body, { password: 'required|min:6|confirmed' });

            if (validate.fails()) {
                return process.res.flash('error', validate.firstError()).back();
            }

            const token = process.req.cookies.Kuppa_session;
            if (!token) {
                return process.res.flash('error', 'Session expired. Please request a new link.')
                                  .toRoute('forgot.password');
            }

            // Update Auth Session
            await supabase.auth.setSession({ access_token: token, refresh_token: '' });
            const { error } = await supabase.auth.updateUser({ password: process.body.password });

            if (error) {
                return process.res.flash('error', error.message).back();
            }

            Session.destroy(process.res);
            return process.res.flash('success', 'Password updated. You can now login.')
                              .toRoute('login');

        } catch (err) {
            return process.res.flash('error', err.message).back();
        }
    }
}

module.exports = AuthController;