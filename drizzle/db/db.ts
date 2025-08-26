import { drizzle } from 'drizzle-orm/node-postgres';

export const db = drizzle({ 
  logger: true,
  connection: { 
    connectionString: `postgres://${process.env.DB_USERNAME}@${process.env.DB_URL}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    ssl: false
    },
});