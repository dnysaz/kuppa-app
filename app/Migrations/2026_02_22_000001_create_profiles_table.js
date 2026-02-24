/**
 * CreateProfilesTable Migration - Kuppa Framework
 * Driven by Supabase (PostgreSQL)
 */

const Migration = coreFile('migrations.BaseMigration');

class CreateProfilesTable extends Migration {
    async up() {
        // 1. Buat Tabel
        const tableSql = this.createTable('profiles', (table) => {
            table.id();
            table.string('email').unique();
            table.string('user_name').nullable().unique();
            table.string('full_name').nullable();
            table.string('avatar_url').nullable();
            table.string('status').nullable();
            table.string('last_login').nullable();
            table.text('bio').nullable();
            table.timestamps();
        });

        // 2. Buat Fungsi & Trigger secara terpisah
        const logicSql = `
            CREATE OR REPLACE FUNCTION public.handle_new_profile()
            RETURNS TRIGGER AS $$
            BEGIN
              INSERT INTO public.profiles (id, email, full_name, user_name, status, avatar_url)
              VALUES (
                new.id, 
                new.email, 
                new.raw_user_meta_data->>'full_name', 
                split_part(new.email, '@', 1), -- Mengambil username dari email (sebelum @)
                'active',
                new.raw_user_meta_data->>'avatar_url'
              );
              RETURN new;
            END;
            $$ LANGUAGE plpgsql SECURITY DEFINER;

            -- Pasang trigger ke auth.users hanya jika belum ada
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created_profile') THEN
                    CREATE TRIGGER on_auth_user_created_profile
                    AFTER INSERT ON auth.users
                    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_profile();
                END IF;
            END $$;
        `;

        return `${tableSql} ${logicSql}`;
    }

    /**
     * Reverse the migrations.
     */
    async down() {
        return this.dropTable('profiles');
    }
}

module.exports = new CreateProfilesTable();