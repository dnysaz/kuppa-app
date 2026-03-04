/**
 * TestApiController - Kuppa API Framework
 * Standardized JSON CRUD Operations
 * Async-Instance Pattern by Ketut Dana
 */

// Core & Application Dependencies
const BaseController = coreFile('controller.BaseController');
const Profile        = appFile('Models.Profile');

class TestApiController extends BaseController {

    /**
     * [GET] List all resources
     */
    async index(process) {
        const user = process.user;
    
        // Guard
        if (!user) {
            return process.json({
                status: 'error',
                message: 'Unauthorized: User session not found'
            }, 401);
        }
    
        const message = 'TestApiController list retrieved successfully';
        const profile = await Profile.find(user.id);
    
        return process.json({
            status: '200',
            message,
            profile
        });
    }

    // do more ...

}

module.exports = TestApiController;