/**
 * HomeController - Kuppa Framework
 * Standardized for The minimalist javascript supabase framework
 */

const BaseController = coreFile('controller.BaseController');

class HomeController extends BaseController {
    
    /**
     * [GET] Index Page
     * Landing page for the application using Fluent Interface
     */
    static async index(process) {
        try {
            const title = 'Hello Kuppa!';
            const message = 'The minimalist javascript supabase framework';

            return process.res.render('welcome').with({ title, message });

        } catch (err) {
            process.next(err);
        }
    }
}

module.exports = HomeController;