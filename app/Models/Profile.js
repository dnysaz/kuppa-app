/**
 * Profile Model - Kuppa Framework
 * Handles data logic for the 'profiles' table
 * Standardized by Ketut Dana
 */

const BaseModel     = coreFile('model.BaseModel');
const { supabase }  = coreFile('config.Database');

class Profile extends BaseModel {
    constructor() {
        /**
         * Pass the table name 'profiles' to the BaseModel
         */
        super('profiles');

        /**
         * Mass Assignment Protection
         */
        this.fillable = [
            'email',
            'user_name',
            'full_name', 
            'avatar_url', 
            'status', 
            'last_login',
            'bio'
        ];
    }

    // --- AUTHENTICATION LOGIC ---

    /**
     * Attempt to login via Supabase Auth
     * @param {string} email 
     * @param {string} password 
     */
    async attemptLogin(email, password) {
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
     * @param {string} name 
     * @param {string} email 
     * @param {string} password 
     */
    async createAccount(name, email, password) {
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

    // --- QUERY LOGIC ---

    async findByEmail(email) {
        return await this.findBy('email', email);
    }

    async findActiveByEmail(email) {
        return await this.findWhere({ 
            email: email, 
            status: 'active' 
        });
    }
}

/**
 * Exporting instance to match Ketut's original architecture
 */
module.exports = new Profile();