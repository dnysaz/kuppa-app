/**
 * AdminController - Kuppa Framework
 * Clean, Instance-based Controller
 * Optimized by Ketut Dana
 */

// Core & Application Dependencies
const BaseController    = coreFile('controller.BaseController');
// const Model          = appFile('Models.YourModel'); 
// const { supabase }   = coreFile('config.Database');
// const Session        = coreFile('auth.Session');
// const Validation     = coreFile('utils.Validation');

class AdminController extends BaseController {

    /**
     * [GET] Index Page
     */
    async index(process) {

        const title         = 'Admin';
        const description   = 'Welcome to admin dashboard!';

        return process.view('admin.index').with({ title, description });
        
    }

}

module.exports = new AdminController();