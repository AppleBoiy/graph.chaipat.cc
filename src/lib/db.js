import { neon } from '@neondatabase/serverless';

const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined in graph repo.');
}

const sql = neon(connectionString);


export default sql;
