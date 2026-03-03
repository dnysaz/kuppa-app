/**
 * Blog Model - Kuppa Framework
 * Standardized for KUPPA ORM - FINAL PRO
 * Optimized for Static & Stateless Execution
 */

const BaseModel = coreFile('model.BaseModel');

class Blog extends BaseModel {
    /**
     * Model Configuration
     */
    static table = 'blogs';
    
    /**
     * Mass Assignment Protection
     */
    static fillable = [
        'title',
        'slug',
        'body',
        'category',
        'status',
        'profile_id'
    ]; 

    /**
     * Registered Relations
     * Must be defined for .with() to work securely
     */
    static relations = {
        profiles: true,
        comments: true
    };

    /**
     * Custom Cache TTL for this model (optional)
     */
    static cacheTTL = 5000; 


    /**
     * Example: Get only published posts
     */
    static async getPublished() {
        return await this.where('status', 'published')
                         .orderBy('created_at', false)
                         .get();
    }
}

/**
 * Exporting Class directly (FINAL PRO Standard)
 */
module.exports = Blog;