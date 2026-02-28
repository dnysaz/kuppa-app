/**
 * ProfileController - Kuppa Framework
 * Standardized for KUPPA ORM - FINAL PRO (Stateless & Static)
 * Refactored for Clean Code & Reliable Persistence by Ketut Dana
 */

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
    async edit(process) {
        const user = process.user;
        const title = 'Edit Profile';
        const description = 'Update your personal information.';

        // Static Fetch from Profile Model
        const profile = await Profile.find(user.id);

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
    }

    /**
     * [POST] Update Profile Action
     */
    async update(process) {
        const userId = process.user.id;
        
        // Handle Multi-part file upload
        const file = await this.upload(process, { folder: 'avatars', field: 'avatar' });
        const input = process.req.body || {};

        // 1. Validation
        const validate = Validation.make(input, {
            fullName: 'required|min:3',
            bio: 'min:3',
        });

        if (validate.fails()) {
            return process.res.flash('error', validate.firstError())
                              .withInput(input)
                              .back();
        }

        // 2. Data Mapping (Explicit Version)
        const updateData = {
            full_name: input.fullName,
            bio: input.bio || null
        };

        // Assign avatar only if file is uploaded
        if (file && file.filename) {
            updateData.avatar_url = `avatars/${file.filename}`;
        }

        // 3. Database Execution via Static Model
        await Profile.where('id', userId).update(updateData);
        
        // Clear global memory cache for this user (Invalidation)
        if (global.kuppaMemory) global.kuppaMemory.delete(userId);

        return process.res.flash('success', 'Profile updated successfully!')
                          .toRoute('profile.edit');
    }

    /**
     * [GET] Display Update Password Page
     */
    async password(process) {
        const token = process.req.cookies.Kuppa_session;
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) return process.res.redirect('/login');

        const provider = user.app_metadata.provider || 'email';
        
        return process.view('dashboard.profile.updatePass').with({
            title: 'Update Password',
            description: 'Update your security credentials',
            loginProvider: provider
        });
    }

    /**
     * [POST] Update Password Action
     */
    async updatePassword(process) {
        const input = process.body || {};

        // 1. Validation
        const validate = Validation.make(input, {
            newPassword: 'required|min:6|confirmed'
        });

        if (validate.fails()) {
            return process.res.flash('error', validate.firstError()).back();
        }

        // 2. Supabase Auth Update
        const { error } = await supabase.auth.updateUser({
            password: input.newPassword
        });

        if (error) {
            const msg = error.message === 'Auth session missing!' 
                ? 'Your session has expired. Please log in again.' 
                : error.message;
            
            return process.res.flash('error', msg).back();
        }

        // 3. Success Response
        return process.res.flash('success', 'Your password has been updated successfully.').back();
    }
}

module.exports = ProfileController;