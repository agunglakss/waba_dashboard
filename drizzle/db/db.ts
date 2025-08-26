import { drizzle } from 'drizzle-orm/node-postgres';

export const db = drizzle({ 
  logger: true,
  connection: { 
    connectionString: process.env.SUPABASE_URL,
    ssl: true
    },
});