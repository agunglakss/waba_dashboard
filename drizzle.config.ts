import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle/migrations',
  schema: './drizzle/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: `${process.env.SUPABASE_URL}`,
  },
  migrations: {
    prefix: "timestamp",
    table: "__drizzle_migrations__",
    schema: "public",
  },
});
