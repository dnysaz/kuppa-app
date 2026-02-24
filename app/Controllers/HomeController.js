/**
 * HomeController - Kuppa Framework
 * Standardized for The minimalist javascript supabase framework
 */

const BaseController = coreFile('controller.BaseController');
// const { supabase }   = coreFile('config.Database');
// const Validation     = coreFile('utils.Validation');
// const YourModel      = appFile('Models.YourModel'); 

class HomeController extends BaseController {
    
    /**
     * [GET] Index Page
     * Landing page for the application using Fluent Interface
     */
    static async index(process) {
        try {
            const title         = 'Hello Kuppa!';
            const description   = 'The minimalist javascript supabase framework';

            return process.view('welcome').with({ title, description });

        } catch (err) {

            process.next(err);
        }
    }

    /**
     * [GET] Help Page
     */
    static async help(process) {

        try {

            const title         = 'Help Menu';
            const description   = 'This is Help Menu!';

            return process.view('help.index').with({title, description});

        } catch (err) {

            process.next(err);
        }
    }

    // Do more ...
}

module.exports = HomeController;