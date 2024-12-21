import express from 'express';
import knex from 'knex';
import config from './database/knexfile.js';

const app = express();
const port = 3001;

app.get('/api/articles', async (req, res) => {
  const db = knex(config);
  
  try {
    console.log('Fetching articles from database...');
    const articles = await db('articles')
      .select('*')
      .orderBy('created_at', 'desc');
    
    console.log(`Found ${articles.length} articles`);
    res.json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ error: 'Failed to fetch articles' });
  } finally {
    await db.destroy();
  }
});

app.listen(port, () => {
  console.log(`API server running at http://localhost:${port}`);
});