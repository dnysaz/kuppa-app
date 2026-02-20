/**
 * Blog Model - Kuppa Framework
 * Handles data logic for the 'blogs' table
 */

const BaseModel = coreFile('model.BaseModel');

class Blog extends BaseModel {
    constructor() {
        /**
         * Pass the table name to the BaseModel
         */
        super('blogs');

        /**
         * Mass Assignment Protection
         * Only columns listed here can be inserted or updated.
         * Example: ['title', 'content', 'status']
         */
        this.fillable = [
            'title',
            'slug',
            'body',
            'category',
            'status'
        ]; 
        
        /**
         * Cache TTL (Time To Live) in milliseconds
         * Default: 5000 (5 seconds)
         */
        this.cacheTTL = 5000;
    }

    /**
     * Define custom relationships or accessors below
     * Example:
     * static async getActive() {
     * return await this.where('is_active', true).get();
     * }
     */
}

module.exports = new Blog();