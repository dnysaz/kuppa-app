/**
 * BlogController - Kuppa Framework
 * Standardized for the minimalist javascript supabase framework
 * Optimized for FINAL PRO ORM (Stateless & Immutable)
 */

// Core & Application Dependencies
const BaseController = coreFile('controller.BaseController');
const Validation     = coreFile('utils.Validation');
const Str            = coreFile('utils.Str');
const Blog           = appFile('Models.Blog'); 

class BlogController extends BaseController {

    /**
     * Render the main blog dashboard
     */
    async index(process) {
        const title = 'Blog Dashboard';
        const description = 'Welcome to Kuppa Blog';
        const layout = 'layouts.app';

        return process.view('blog.index').with({ 
            title,
            description,
            layout
        });
    }

    /**
     * Display a list of blogs with author profiles
     */
    async myBlog(process) {
        const title = 'Kuppa Blog';
        const description = 'Welcome to my Blog';
        
        // Ambil halaman dari query string URL, default ke 1
        const page = process.req.query.page || 1;

        // Final Pro Query: Pass an object to paginate
        const blogs = await Blog.query()
                                .with('profiles')
                                .orderBy('created_at', false)
                                .paginate({ 
                                    page: page, 
                                    perPage: 4 
                                });

        return process.view('blog.my-blog').with({
            title,
            description,
            blogs // blogs sekarang berisi { data, meta }
        });
    }

    /**
     * Store a newly created blog post in database
     */
    async store(process) {
        // Validation Layer
        const validate = Validation.make(process.body, {
            title: 'required|min:3',
            category: 'required',
            body: 'required|min:6'
        });

        if (validate.fails()) {
            return process.res.flash('error', validate.firstError())
                              .withInput(process.body)
                              .back();
        }

        const { title, category, body } = process.body;

        // Data Payload Construction
        const payload = {
            title,
            category,
            body,
            slug: Str.slug(title),
            status: 'published',
            profile_id: process.user.id
        };

        // Static shortcut .create() is safe to use directly
        await Blog.create(payload);

        return process.res.flash('success', 'Post created successfully').toRoute('blog');
    }

    /**
     * Display the specified blog post detail
     */
    async show(process) {
        const slug = process.params.slug;

        // Final Pro Query: Use .query() to combine relations and filters
        const blog = await Blog.query()
                               .with('profiles')
                               .where('slug', slug)
                               .first();

        if (!blog) {
            return process.res.flash('error', 'Article not found').toRoute('blog');
        }

        const title = blog.title;

        return process.view('blog.show').with({
            title,
            blog 
        });
    }

    /**
     * Show the form for editing the specified blog post
     */
    async edit(process) {
        const slug = process.params.slug;

        // Static shortcut .where() handles query initialization internally
        const blog = await Blog.where('slug', slug).first();

        if (!blog) {
            return process.res.flash('error', 'Article not found').toRoute('blog');
        }

        // Ownership Verification
        if (blog.profile_id !== process.user.id) {
            return process.res.flash('error', 'Unauthorized: You do not own this post').toRoute('blog');
        }

        const title = 'Edit Post: ' + blog.title;

        return process.view('blog.edit').with({
            title,
            blog
        });
    }

    /**
     * Update the specified blog post in database
     */
    async update(process) {
        const currentSlug = process.params.slug;
        
        // 1. Fetch current data to verify ownership
        const blog = await Blog.where('slug', currentSlug).first();
        
        if (!blog || blog.profile_id !== process.user.id) {
            return process.res.flash('error', 'Unauthorized: Update failed').toRoute('blog');
        }

        // 2. Validation
        const validate = Validation.make(process.body, {
            title: 'required|min:3',
            category: 'required',
            body: 'required|min:6'
        });

        if (validate.fails()) {
            return process.res.flash('error', validate.firstError()).back();
        }

        const { title, category, body } = process.body;

        // 3. Construct update payload
        const payload = {
            title,
            category,
            body,
            slug: Str.slug(title),
            status: 'published'
        };

        // 4. Execution via dynamic WHERE clause (Final Pro Immutable)
        await Blog.where('id', blog.id).update(payload);

        return process.res.flash('success', 'Post updated successfully').toRoute('blog');
    }

    /**
     * Remove the specified blog post from database
     */
    async destroy(process) {
        const slug = process.params.slug;

        // Ownership Verification before deletion
        const blog = await Blog.where('slug', slug).first();

        if (!blog || blog.profile_id !== process.user.id) {
            return process.res.flash('error', 'Unauthorized: Delete failed').toRoute('blog');
        }

        // Execution via dynamic WHERE clause (Final Pro Immutable)
        await Blog.where('id', blog.id).delete();

        return process.res.flash('success', 'Post deleted successfully').toRoute('blog');
    }
}

module.exports = BlogController;