/**
 * DashboardController - Kuppa Framework
 * Standardized for The minimalist javascript supabase framework
 * Ultra Clean Version: No redundant try-catch (Handled by RouteWrapper)
 */

const BaseController = coreFile('controller.BaseController');
// const { supabase }   = coreFile('config.Database');
// const Validation     = coreFile('utils.Validation');
// const Model          = appFile('Models.yourModel'); 

class DashboardController extends BaseController {

    /**
     * [GET] Dashboard Page
     * Directly returns the view, clean and efficient.
     */
    async index(process) {
        const title       = 'Dashboard';
        const description = 'Overview of your application and system status.';
        const content     =  'Hello this is content from DashboardController!';

        return process.view('dashboard.index').with({ 
            title, 
            description,
            content
        });
    }

}

module.exports = DashboardController;