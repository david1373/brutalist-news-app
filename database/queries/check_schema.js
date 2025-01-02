import knex from 'knex';
import config from '../knexfile.js';

const db = knex(config);

async function checkSchema() {
  try {
    const articles = await db.raw(`PRAGMA table_info(articles);`);
    console.log('Articles table schema:', articles);
    await db.destroy();
  } catch (error) {
    console.error('Error:', error);
    await db.destroy();
  }
}

checkSchema();