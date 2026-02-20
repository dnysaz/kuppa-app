const BaseModel = coreFile('model/BaseModel');

/**
 * User Model - Kuppa Framework
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

    async findByEmail(email) {
        return await this.findBy('email', email);
    }

    async findActiveByEmail(email) {
        return await this.where('email', email)
                         .where('status', 'active')
                         .first();
    }
}

module.exports = new User();