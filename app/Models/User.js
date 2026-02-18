const BaseModel = require('../../core/model/BaseModel');

/**
 * User Model - Kuppa Framework
 * Serious & Fast Data Management
 */
class User extends BaseModel {
    constructor() {
        // Mengarahkan model ke tabel 'users' di Supabase
        super('users');

        /**
         * Fillable Protection
         * Menentukan kolom mana saja yang boleh diisi secara massal (Mass Assignment).
         * Kolom 'id' dan 'role' sengaja tidak dimasukkan demi keamanan.
         */
        this.fillable = [
            'email', 
            'full_name', 
            'avatar_url', 
            'status', 
            'last_login'
        ];
    }

    /**
     * Mencari user berdasarkan Email
     * Berguna untuk proses login atau verifikasi akun.
     */
    async findByEmail(email) {
        return await this.findBy('email', email);
    }

    /**
     * Mencari user yang berstatus 'active' berdasarkan email.
     * Memberikan layer keamanan tambahan untuk memblokir user yang di-suspend.
     */
    async findActiveByEmail(email) {
        return await this.where('email', email)
                         .where('status', 'active')
                         .first();
    }
}

// Export instance agar bisa langsung dipanggil tanpa 'new' di Controller
module.exports = new User();