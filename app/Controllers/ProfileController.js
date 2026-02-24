/**
 * ProfileController - Kuppa Framework
 * Standardized for The minimalist javascript supabase framework
 */

// Core & Application Dependencies
const BaseController = coreFile('controller.BaseController');
const { supabase }   = coreFile('config.Database');
const Validation     = coreFile('utils.Validation');
const Profile        = appFile('Models.Profile'); 
const runUploader    = coreFile('utils.Uploader');

class ProfileController extends BaseController {

    /**
     * Helper Wrapper for Uploader
     * Strictly using process object
     */
    async upload(process, options) {
        
        return await runUploader(process.req, process.res, options);
    }

    /**
     * [GET] Edit Profile Page
     */
    static async edit(process) {
        try {
            const user          = process.user;
            const title         = 'Edit Profile';
            const description   = 'Update your personal information.';

            // Fetch current profile data from DB (UUID check)
            const profile = await Profile.find(user?.id || user?.sub);

            /**
             * ABSOLUTE PATH LOGIC
             * Ensure avatar path is correct for HBS rendering
             */
            let displayAvatar = profile?.avatar_url;
            if (displayAvatar && !displayAvatar.startsWith('http')) {
                displayAvatar = `/uploads/${displayAvatar}`;
            }

            const userData = {
                id: profile?.id,
                email: profile?.email,
                userName: profile?.user_name || '',
                fullName: profile?.full_name || '',
                avatar: displayAvatar, 
                bio: profile?.bio || ''
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

        const controller = new ProfileController();

        try {
            const userId = process.user?.id;

            if (!userId) return process.res.redirect('/login');

            const file = await controller.upload(process, { folder: 'avatars', field: 'avatar' });
            
            // Ambil input setelah upload selesai
            const input = process.req.body || {};

            // 2. Validation
            const validate = Validation.make(input, {
                fullName: 'required|min:3',
                bio: 'min:3',
            });

            if (validate.fails()) {
                process.res.flash('error', validate.firstError());
                process.res.withInput(input);
                return process.res.redirect('back');
            }

            // 3. Map Update Data
            const updateData = {
                full_name: input.fullName,
                bio: input.bio || null, 
                ...(file?.filename && { avatar_url: `avatars/${file.filename}` })
            };

            // 4. Database Execution
            await Profile.update(userId, updateData);
            
            if (updateData.avatar_url && process.res.locals.globalUser) {
                process.res.locals.globalUser.avatar = `/uploads/${updateData.avatar_url}`;
            }

            global.kuppaCache = {}; 
            process.res.flash('success', 'Profile updated successfully!');
            return process.res.redirect('/profile/edit-profile');

        } catch (err) {
            console.error('[Profile Update Error]:', err.message);
            process.res.flash('error', 'Update Failed: ' + err.message);
            return process.res.redirect('back');
        }
    }

    /**
     * [GET] Display Update Password Page
     */
    static async password(process) {
        try {
            const token = process.req.cookies.Kuppa_session;
            const { data: { user }, error } = await supabase.auth.getUser(token);

            if (error || !user) return process.res.redirect('/login');

            const provider = user.app_metadata.provider || 'email';
            
            return process.view('dashboard.profile.updatePass').with({
                title: 'Update Password',
                description: 'Update your security credentials',
                loginProvider: provider
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
            const input = process.body || {};

            // 1. Validation
            const validate = Validation.make(input, {
                newPassword: 'required|min:6|confirmed'
            });

            if (validate.fails()) {
                process.res.flash('error', validate.firstError());
                return process.res.redirect('back');
            }

            // 2. Supabase Auth Update
            const { error } = await supabase.auth.updateUser({
                password: input.newPassword
            });

            if (error) {
                const msg = error.message === 'Auth session missing!' 
                    ? 'Your session has expired. Please log in again.' 
                    : error.message;
                
                process.res.flash('error', msg);
                return process.res.redirect('back');
            }

            // 3. Success Response
            process.res.flash('success', 'Your password has been updated successfully.');
            return process.res.redirect('back');

        } catch (err) {
            console.error('[Password Update Error]:', err.message);
            process.res.flash('error', 'An internal error occurred.');
            return process.res.redirect('back');
        }
    }
}

module.exports = ProfileController;