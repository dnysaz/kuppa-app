/**
 * CreateBlogsTable Migration - Kuppa Framework
 * Driven by Supabase (PostgreSQL)
 */

const Migration = coreFile('migrations.BaseMigration');

class CreateBlogsTable extends Migration {
    /**
     * Run the migrations.
     */
    async up() {
        return this.createTable('blogs', (table) => {
            table.id(); 
            table.string('title');
            table.string('slug');
            table.text('body');
            table.string('category').default('general');
            table.string('status').default('draft');
            table.uuid('user_id').references('users', 'id');
            table.timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    async down() {
        return this.dropTable('blogs');
    }
}

module.exports = new CreateBlogsTable();