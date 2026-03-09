/**
 * AdminController - Kuppa Framework
 * Clean, Instance-based Controller
 * Optimized by Ketut Dana
 */

// Core & Application Dependencies
const BaseController    = coreFile('Controller.BaseController');
// const Model          = appFile('Models.YourModel'); 
// const { supabase }   = coreFile('Config.Database');
// const Session        = coreFile('Auth.Session');
// const Validation     = coreFile('Utils.Validation');

class AdminController extends BaseController {

    /**
     * [GET] Index Page
     */
    async index(process) {

        const title         = 'Admin';
        const description   = 'Welcome to admin dashboard!';

        return process.view('Admin.index').with({ title, description });
        
    }

}

module.exports = new AdminController();