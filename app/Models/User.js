const BaseModel = coreFile('model/BaseModel');
const { supabase } = coreFile('config.Database');

/**
 * User Model - Kuppa Framework
 * Standardized for minimalist javascript supabase framework
 * Optimized by Ketut Dana
 */
class User extends BaseModel {
    constructor() {
        super('users');

        this.fillable = [
            'email', 
            'full_name', 
            'avatar_url', 
            'status', 
            'last_login'
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

    /**
     * Find user by email using BaseModel findBy
     */
    async findByEmail(email) {
        return await this.findBy('email', email);
    }

    /**
     * Find active user by email using BaseModel findWhere
     */
    async findActiveByEmail(email) {
        return await this.findWhere({ 
            email: email, 
            status: 'active' 
        });
    }
}

module.exports = new User();