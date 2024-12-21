import knex from 'knex';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../.env') });

const config = {
  client: 'pg',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'brutalist_dev',
    user: process.env.DB_USER || process.platform === 'darwin' ? process.env.USER : 'postgres',
    password: process.env.DB_PASSWORD || ''
  },
  migrations: {
    directory: join(__dirname, '../database/migrations')
  }
};

async function runMigrations() {
  const db = knex(config);
  try {
    console.log('Running migrations...');
    await db.migrate.latest();
    console.log('Migrations completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await db.destroy();
  }
}

runMigrations();