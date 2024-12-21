import knex from 'knex';
import config from '../database/knexfile.js';

async function runMigrations() {
  const db = knex(config);
  
  try {
    console.log('Running migrations...');
    const [batchNo, log] = await db.migrate.latest();
    console.log(`Batch ${batchNo} completed`);
    console.log('Migrations:', log);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await db.destroy();
  }
}

runMigrations();