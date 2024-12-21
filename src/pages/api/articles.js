import knex from 'knex';
import config from '../../../database/knexfile.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const db = knex(config);
  
  try {
    const articles = await db('articles')
      .select('*')
      .orderBy('created_at', 'desc');
    
    res.status(200).json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ error: 'Failed to fetch articles' });
  } finally {
    await db.destroy();
  }
}
