const Migration = require('../../core/migrations/BaseMigration');

class CreateBlogsTable extends Migration {
    /**
     * Run the migrations.
     */
    async up() {
        return this.createTable('blogs', (table) => {
            table.id();
            table.foreignId('user_id');
            table.string('title');
            table.string('slug').unique();
            table.text('content');
            table.string('thumbnail').nullable();
            table.enum('status', ['draft', 'published']).default('draft');
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