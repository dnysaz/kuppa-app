/**
 * HomeController - Kuppa Framework
 * Standardized for The minimalist javascript supabase framework
 */

const BaseController = require('../../core/controller/BaseController');

class HomeController extends BaseController {
    
    /**
     * [GET] Index Page
     * Landing page for the application
     */
    static async index(process) {
        try {
            process.render('welcome', { 
                title: 'Welcome Page!',
                message: 'Welcome to Kuppa Framework' 
            });
        } catch (err) {
            console.error('[Kuppa Error]', err.message);
        }
        
        process.error;
    }
}

module.exports = HomeController;