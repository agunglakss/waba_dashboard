import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle/migrations',
  schema: './drizzle/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: `postgres://${process.env.DB_USERNAME}@${process.env.DB_URL}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  },
  migrations: {
    prefix: "timestamp",
    table: "__drizzle_migrations__",
    schema: "public",
  },
});
