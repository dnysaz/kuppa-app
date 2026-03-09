/**
 * DashboardController - Kuppa Framework
 * Standardized for The minimalist javascript supabase framework
 * Ultra Clean Version: No redundant try-catch (Handled by RouteWrapper)
 */

const BaseController    = coreFile('Controller.BaseController');
// const { supabase }   = coreFile('Config.Database');
// const Validation     = coreFile('Utils.Validation');
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

        return process.view('Dashboard.index').with({ 
            title, 
            description,
            content
        });
    }

}

module.exports = DashboardController;