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

            process.render('dashboard.index', { 
                title: 'Dashboard', 
                description: 'Overview of your application and system status.',
                userData: {
                    id: user?.id || user?.sub,
                    email: user?.email,
                    fullName: user?.full_name || 'User',
                    avatar: user?.avatar_url,
                    joinedAt: user?.created_at
                }
            });
        } catch (err) {
            console.error('[Kuppa Error]', err.message);
        }
        process.error;
    }

    /**
     * [GET] Edit Profile Page
     */
    static async edit(process) {
        try {
            const user = process.user;

            process.render('dashboard.profile.editProfile', { 
                title: 'Edit Profile',
                description: 'Update your personal information.',
                userData: {
                    id: user?.id || user?.sub,
                    email: user?.email,
                    fullName: user?.full_name || '',
                    avatar: user?.avatar_url
                }
            });
        } catch (err) {
            console.error('[Kuppa Error]', err.message);
        }
        process.error;
    }

    /**
     * [POST] Update Profile Action
     */
    static async update(process) {
        const controller = new DashboardController();
        try {
            const userId = process.user?.id || process.user?.sub;
            if (!userId) return process.redirect('login');

            // 1. Handle Upload via BaseController Helper
            // Multer akan memproses stream data di sini
            const avatarPath = await controller.upload(process, { 
                folder: 'avatars', 
                field: 'avatar' 
            });

            // 2. Ambil data fullName dari req.body (BUKAN process.body)
            // Karena Multer mengisi objek request asli
            const { fullName } = process.req.body;

            const updateData = {
                full_name: fullName
            };

            // 3. Jika upload berhasil, masukkan path ke updateData
            if (avatarPath) {
                updateData.avatar_url = avatarPath;
            }

            // 4. Update Database
            await User.update(userId, updateData);

            process.redirect('dashboard');
        } catch (err) {
            console.error('[Kuppa Error] Profile Update Failed:', err.message);
            process.redirect('profile.editProfile');
        }
        process.error;
    }

    /**
     * [GET] Password Update Page
     */
    static async password(process) {
        process.render('dashboard.profile.updatePass', {
            title: 'Security Settings',
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
            // 1. Validasi Input Kosong
            if (!newPassword || !confirmPassword) {
                return process.render('dashboard.profile.updatePass', {
                    title: 'Security Settings',
                    errorMessage: 'New password fields are required.'
                });
            }

            // 2. Validasi Kecocokan Password
            if (newPassword !== confirmPassword) {
                return process.render('dashboard.profile.updatePass', {
                    title: 'Security Settings',
                    errorMessage: 'New password and confirmation do not match.'
                });
            }

            // 3. Update Password via Supabase Auth SDK
            // Supabase otomatis akan menghandle hashing dan update di auth.users
            const { error } = await supabase.auth.updateUser({
                password: newPassword
            });

            if (error) {
                return process.render('dashboard.profile.updatePass', {
                    title: 'Security Settings',
                    errorMessage: error.message
                });
            }

            // 4. Jika berhasil, render kembali ke password dengan pesan sukses
            // Atau bisa ke dashboard sesuai keinginanmu
            return process.render('dashboard.profile.updatePass', {
                title: 'Security Settings',
                description: 'Your password has been updated successfully.'
            });

        } catch (err) {
            console.error('[Kuppa Error]', err.message);
            return process.render('dashboard.profile.updatePass', {
                title: 'Security Settings',
                errorMessage: 'An unexpected error occurred.'
            });
        }
        process.error;
    }
}

module.exports = DashboardController;