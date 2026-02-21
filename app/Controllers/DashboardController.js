/**
 * DashboardController - Kuppa Framework
 * Standardized for The minimalist javascript supabase framework
 * Refactored with Validation & Model Sync by Ketut Dana
 */

// Core System Dependencies
const BaseController = coreFile('controller.BaseController');
const { supabase }   = coreFile('config.Database');
const Validation     = coreFile('utils.Validation');

// Application Dependencies
const User           = appFile('Models.User');

class DashboardController extends BaseController {

    /**
     * [GET] Dashboard Page
     */
    static async index(process) {
        try {
            const user          = process.user;
            const globalData    = process.res.locals.globalUser;
            const title         = 'Dashboard';
            const description   = 'Overview of your application and system status.';
            
            const userData = {
                id: user?.id || user?.sub,
                email: user?.email,
                fullName: user?.full_name || 'User',
                avatar: globalData?.avatar || user?.avatar_url, 
                joinedAt: user?.created_at
            };

            return process.view('dashboard.index').with({ 
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
            const user          = process.user;
            const globalData    = process.res.locals.globalUser;
            const title         = 'Edit Profile';
            const description   = 'Update your personal information.';

            const userData = {
                id: user?.id || user?.sub,
                email: user?.email,
                fullName: user?.full_name || '',
                avatar: globalData?.avatar || user?.avatar_url
            };

            return process.view('dashboard.profile.editProfile').with({ 
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
            const title  = 'Edit Profile';
            const view   = 'dashboard.profile.editProfile';

            if (!userId) return process.res.redirect('/login');

            // 1. Handle Upload
            const avatarPath = await controller.upload(process, { 
                folder: 'avatars', 
                field: 'avatar' 
            });

            // 2. Safe Body Access (Important for multipart)
            const body = process.body || process.req.body || {};
            const { fullName } = body;

            // 3. Validation Logic
            const validate = Validation.make(body, {
                fullName: 'required|min:3'
            });

            if (validate.fails()) {
                const user = process.user;
                return process.view(view).with({
                    title,
                    errorMessage: validate.firstError(),
                    userData: { 
                        fullName: fullName, 
                        avatar: user?.avatar_url 
                    }
                });
            }

            // 4. Prepare Update Payload
            const updateData = {};
            if (fullName) updateData.full_name = fullName;
            if (avatarPath) updateData.avatar_url = avatarPath;

            // 5. Update via Model
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
            const title       = 'Update Password';
            const description = 'Update your password!';

            return process.view('dashboard.profile.updatePass').with({
                title,
                description
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
            const title   = 'Update Password';
            const view    = 'dashboard.profile.updatePass';
            const expired = 'Your session has expired. Please log in again.';

            // 1. Validation Logic (Laravel-style)
            const validate = Validation.make(process.body, {
                newPassword: 'required|min:6|confirmed'
            });

            if (validate.fails()) {
                return process.view(view).with({
                    title,
                    errorMessage: validate.firstError()
                });
            }

            // 2. Update via Supabase SDK
            const { error } = await supabase.auth.updateUser({
                password: process.body.newPassword
            });

            if (error) {
                const msg = error.message === 'Auth session missing!' ? expired : error.message;
                return process.view(view).with({
                    title,
                    errorMessage: msg
                });
            }

            return process.view(view).with({
                title,
                successMessage: 'Your password has been updated successfully.'
            });

        } catch (err) {
            process.next(err);
        }
    }
}

module.exports = DashboardController;