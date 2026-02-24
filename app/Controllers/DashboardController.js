/**
 * DashboardController - Kuppa Framework
 * Standardized for The minimalist javascript supabase framework
 */

// Core & Application Dependencies
const BaseController = coreFile('controller.BaseController');
// const { supabase }   = coreFile('config.Database');
// const Validation     = coreFile('utils.Validation');
// const YourModel      = appFile('Models.YourModel'); 


class DashboardController extends BaseController {

    /**
     * [GET] Dashboard Page
     */
    static async index(process) {
        try {
            const title         = 'Dashboard';
            const description   = 'Overview of your application and system status.';
            const layout        = 'layouts.app';
            const content       = 'Example content from Dashboard Controller for Dashboard view.';

            return process.view('dashboard.index').with({ 
                title, 
                description,
                content,
                layout
            });
        } catch (err) {
            process.next(err);
        }
    }

    // Do more ...
    
}

module.exports = DashboardController;