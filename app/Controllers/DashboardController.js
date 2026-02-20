/**
 * DashboardController - Kuppa Framework
 * Standardized for The minimalist javascript supabase framework
 * Updated by Ketut Dana
 */

// Core System Dependencies
const BaseController = coreFile('controller.BaseController');
const { supabase }   = coreFile('config.Database');

// Application Dependencies
const User           = appFile('Models.User');

class DashboardController extends BaseController {

    /**
     * [GET] Dashboard Page
     */
    static async index(process) {
        try {
            const user = process.user;
            const globalData = process.res.locals.globalUser;
            const title = 'Dashboard';
            const description = 'Overview of your application and system status.';
            
            const userData = {
                id: user?.id || user?.sub,
                email: user?.email,
                fullName: user?.full_name || 'User',
                avatar: globalData?.avatar || user?.avatar_url, 
                joinedAt: user?.created_at
            };

            return process.res.render('dashboard.index').with({ 
                title, 
                description,
                userData
            });
        } catch (err) {
            process.next(err);
        }
    }

    /**
     * [GET] Edit Profile Page
     */
    static async edit(process) {
        try {
            const user = process.user;
            const globalData = process.res.locals.globalUser;
            const title = 'Edit Profile';
            const description = 'Update your personal information.';

            const userData = {
                id: user?.id || user?.sub,
                email: user?.email,
                fullName: user?.full_name || '',
                avatar: globalData?.avatar || user?.avatar_url
            };

            return process.res.render('dashboard.profile.editProfile').with({ 
                title,
                description,
                userData
            });
        } catch (err) {
            process.next(err);
        }
    }

    /**
     * [POST] Update Profile Action
     */
    static async update(process) {
        const controller = new DashboardController();
        try {
            const userId = process.user?.id || process.user?.sub;
            if (!userId) return process.res.redirect('/login');

            const avatarPath = await controller.upload(process, { 
                folder: 'avatars', 
                field: 'avatar' 
            });

            const { fullName } = process.req.body;
            const updateData = {};
            
            if (fullName) updateData.full_name = fullName;
            if (avatarPath) updateData.avatar_url = avatarPath;

            if (Object.keys(updateData).length > 0) {
                await User.update(userId, updateData);
            }

            return process.res.redirect('/dashboard');

        } catch (err) {
            process.next(err);
        }
    }

    /**
     * [GET] Password Update Page
     */
    static async password(process) {
        try {
            return process.res.render('dashboard.profile.updatePass').with({
                title: 'Update Password',
                description: 'Update your password!'
            });
        } catch (err) {
            process.next(err);
        }
    }

    /**
     * [POST] Update Password Action
     */
    static async updatePassword(process) {
        try {
            const { currentPassword, newPassword, confirmPassword } = process.body;
            const title = 'Update Password';
            const view = 'dashboard.profile.updatePass';

            // 1. Validation for Empty Inputs
            if (!newPassword || !confirmPassword) {
                return process.res.render(view).with({
                    title,
                    errorMessage: 'New password fields are required.'
                });
            }

            // 2. Validation for Match
            if (newPassword !== confirmPassword) {
                return process.res.render(view).with({
                    title,
                    errorMessage: 'New password and confirmation do not match.'
                });
            }

            // 3. Update via Supabase SDK
            const { error } = await supabase.auth.updateUser({
                password: newPassword
            });

            if (error) {
                const msg = error.message === 'Auth session missing!' 
                            ? 'Your session has expired. Please log in again.' 
                            : error.message;

                return process.res.render(view).with({
                    title,
                    errorMessage: msg
                });
            }

            return process.res.render(view).with({
                title,
                successMessage: 'Your password has been updated successfully.'
            });

        } catch (err) {
            process.next(err);
        }
    }
}

module.exports = DashboardController;