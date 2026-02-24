/**
 * BlogController - Kuppa Framework
 * Standardized for The minimalist javascript supabase framework
 */

// Core & Application Dependencies
const BaseController = coreFile('controller.BaseController');
// const { supabase }   = coreFile('config.Database');
// const Validation     = coreFile('utils.Validation');
// const YourModel      = appFile('Models.YourModel'); 

class BlogController extends BaseController {

    /**
     * [GET] Blog Page
     */
    static async index(process) {
        try {
            const title       = 'This is Blog!';
            const description = 'Welcome to Kuppa Blog';
            const layout      = 'layouts.app';

            return process.view('blog.index').with({ 
                title,
                description,
                layout
            });
        } catch (err) {
            process.next(err);
        }
    }

    // do more ...
}

module.exports = BlogController;