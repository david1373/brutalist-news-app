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
    database: 'brutalist_dev',
    user: process.platform === 'darwin' ? process.env.USER : 'postgres',
  },
  migrations: {
    directory: join(__dirname, '../database/migrations')
  },
  debug: true
};

async function runMigrations() {
  const db = knex(config);
  
  try {
    console.log('Testing database connection...');
    await db.raw('SELECT 1');
    console.log('Database connection successful!');

    console.log('Running migrations...');
    const [batchNo, log] = await db.migrate.latest();
    console.log(`Batch ${batchNo} completed:`, log);
    console.log('Migrations completed successfully!');
  } catch (error) {
    console.error('Error details:', error);
    process.exit(1);
  } finally {
    await db.destroy();
  }
}

runMigrations();