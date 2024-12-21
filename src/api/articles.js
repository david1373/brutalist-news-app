import knex from 'knex';
import config from '../../database/knexfile.js';

export default async function handler(req, res) {
  const db = knex(config);
  
  try {
    const articles = await db('articles')
      .select('*')
      .orderBy('published_date', 'desc');
    
    res.json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ error: 'Failed to fetch articles' });
  } finally {
    await db.destroy();
  }
}