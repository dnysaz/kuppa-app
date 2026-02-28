/**
 * Profile Model - Kuppa Framework
 * Standardized for KUPPA ORM - FINAL PRO
 * Optimized by Ketut Dana
 */

const BaseModel = coreFile('model.BaseModel');
const { supabase } = coreFile('config.Database');

class Profile extends BaseModel {
    /**
     * Model Configuration
     */
    static table = 'profiles';
    
    static fillable = [
        'email',
        'user_name',
        'full_name', 
        'avatar_url',
        'role',
        'status', 
        'provider',
        'last_login',
        'bio'
    ];

    /**
     * Registered Relations
     * Allow blog to call with('profiles') or profile call with('blogs')
     */
    static relations = {
        blogs: true
    };

    // --- AUTHENTICATION LOGIC (STATIC) ---

    /**
     * Attempt to login via Supabase Auth
     */
    static async attemptLogin(email, password) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;

        // Sync session state to SDK
        await supabase.auth.setSession({
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token
        });

        return data.session;
    }

    /**
     * Create a new account in Supabase Auth
     */
    static async createAccount(name, email, password) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { 
                data: { full_name: name } 
            }
        });

        if (error) throw error;
        return data;
    }

    // --- QUERY LOGIC (STATIC) ---

    static async findByEmail(email) {
        return await this.where('email', email).first();
    }

    static async findActiveByEmail(email) {
        return await this.where('email', email)
                         .where('status', 'active')
                         .first();
    }
}

/**
 * Exporting Class directly for Static Access (FINAL PRO Standard)
 */
module.exports = Profile;