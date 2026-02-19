const User = require('../Models/User');
const BaseController = require('../../core/controller/BaseController');
const { supabase } = require('../../core/config/Database');


/**
 * DashboardController - Kuppa Framework
 * Optimized for The minimalist javascript supabase framework with BaseController Inheritance
 */
class DashboardController extends BaseController {

/**
     * [GET] Dashboard Page
     */
    static async index(process) {
        try {
            const user = process.user;
            const globalData = process.res.locals.globalUser;

            process.render('dashboard.index', { 
                title: 'Dashboard', 
                description: 'Overview of your application and system status.',
                userData: {
                    id: user?.id || user?.sub,
                    email: user?.email,
                    fullName: user?.full_name || 'User',
                    avatar: globalData?.avatar || user?.avatar_url, 
                    joinedAt: user?.created_at
                }
            });
        } catch (err) {
            console.error('[Kuppa Error]', err.message);
        }
    }

    /**
     * [GET] Edit Profile Page
     */
    static async edit(process) {
        try {
            const user = process.user;
            // Ambil data yang sudah dirapikan Middleware
            const globalData = process.res.locals.globalUser;

            process.render('dashboard.profile.editProfile', { 
                title: 'Edit Profile',
                description: 'Update your personal information.',
                userData: {
                    id: user?.id || user?.sub,
                    email: user?.email,
                    fullName: user?.full_name || '',
                    avatar: globalData?.avatar || user?.avatar_url
                }
            });
        } catch (err) {
            console.error('[Kuppa Error]', err.message);
        }
    }

    /**
     * [POST] Update Profile Action
     */
    static async update(process) {
        const controller = new DashboardController();
        try {
            const userId = process.user?.id || process.user?.sub;
            if (!userId) return process.redirect('login');

            const avatarPath = await controller.upload(process, { 
                folder: 'avatars', 
                field: 'avatar' 
            });

            const { fullName } = process.req.body;

            const updateData = {};
            
            if (fullName) {
                updateData.full_name = fullName;
            }

            if (avatarPath) {
                updateData.avatar_url = avatarPath;
            }

            if (Object.keys(updateData).length > 0) {
                await User.update(userId, updateData);
            }

            return process.redirect('dashboard');

        } catch (err) {
            console.error('[Kuppa Error] Profile Update Failed:', err.message);
            return process.redirect('dashboard/edit-profile'); 
        }
    }

    /**
     * [GET] Password Update Page
     */
    static async password(process) {
        process.render('dashboard.profile.updatePass', {
            title: 'Update Password',
            description: 'Update your password!'

        });
        process.error;
    }

    /**
     * [POST] Update Password Action
     * Menggunakan SDK Supabase untuk mengupdate password di auth.users
     */
    static async updatePassword(process) {
        const { newPassword, confirmPassword } = process.body;

        try {
            if (!newPassword || !confirmPassword) {
                return process.render('dashboard.profile.updatePass', {
                    title: 'Update Password',
                    errorMessage: 'New password fields are required.'
                });
            }

            if (newPassword !== confirmPassword) {
                return process.render('dashboard.profile.updatePass', {
                    title: 'Update Password',
                    errorMessage: 'New password and confirmation do not match.'
                });
            }

            const { error } = await supabase.auth.updateUser({
                password: newPassword
            });

            if (error) {
                return process.render('dashboard.profile.updatePass', {
                    title: 'Update Password',
                    errorMessage: error.message
                });
            }

            return process.render('dashboard.profile.updatePass', {
                title: 'Update Password',
                description: 'Your password has been updated successfully.'
            });

        } catch (err) {
            console.error('[Kuppa Error]', err.message);
            return process.render('dashboard.profile.updatePass', {
                title: 'Update Password',
                errorMessage: 'An unexpected error occurred.'
            });
        }
        process.error;
    }
}

module.exports = DashboardController;