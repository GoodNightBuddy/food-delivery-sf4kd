import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool: Pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
  database: process.env.DB_DATABASE,
});

export default pool;
