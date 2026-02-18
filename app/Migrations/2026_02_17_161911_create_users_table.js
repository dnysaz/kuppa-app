const Migration = require('../../core/migrations/BaseMigration');

class CreateUsersTable extends Migration {
    async up() {
        // 1. Buat Tabel
        const tableSql = this.createTable('users', (table) => {
            table.id();
            table.string('email').unique();
            table.string('full_name').nullable();
            table.string('avatar_url').nullable();
            table.timestamps();
        });

        // 2. Buat Fungsi & Trigger secara terpisah agar mudah didebug
        const logicSql = `
            CREATE OR REPLACE FUNCTION public.handle_new_user()
            RETURNS TRIGGER AS $$
            BEGIN
              INSERT INTO public.users (id, email, full_name, avatar_url)
              VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
              RETURN new;
            END;
            $$ LANGUAGE plpgsql SECURITY DEFINER;

            -- Jalankan trigger hanya jika belum ada
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created') THEN
                    CREATE TRIGGER on_auth_user_created
                    AFTER INSERT ON auth.users
                    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
                END IF;
            END $$;
        `;

        return `${tableSql} ${logicSql}`;
    }

    async down() {
        // Jangan hapus trigger di down agar tidak kena ownership error saat rollback
        return this.dropTable('users');
    }
}

module.exports = new CreateUsersTable();