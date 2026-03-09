/**
 * HomeController - Kuppa Framework
 * Standardized for The minimalist javascript supabase framework
 * Cleaned: No more manual try-catch (Handled by RouteWrapper)
 */

const BaseController    = coreFile('Controller.BaseController');
// const { supabase }   = coreFile('Config.Database');
// const Validation     = coreFile('Utils.Validation');
const Profile           = appFile('Models.Profile'); 

class HomeController extends BaseController {
    
    /**
     * [GET] Index Page
     * Landing page for the application using Fluent Interface
     */
    async index(process) {

        const title       = 'Hello Kuppa!';
        const description = 'The minimalist javascript supabase framework';

        return process.view('welcome').with({ 
            title, 
            description
        });
    }

    /**
     * [GET] Help Page
     */
    async help(process) {
        const title       = 'Help Menu';
        const description = 'This is Help Menu!';

        return process.view('Help.index').with({
            title,
            description 
        });
    }

    // Do more ...
}

module.exports = HomeController;