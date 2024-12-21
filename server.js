import express from 'express';
import knex from 'knex';
import config from './database/knexfile.js';

const app = express();
const port = 3001;

// Get all articles
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

// Get single article by ID
app.get('/api/articles/:id', async (req, res) => {
  const db = knex(config);
  
  try {
    const article = await db('articles')
      .where({ id: req.params.id })
      .first();
    
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    
    res.json(article);
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({ error: 'Failed to fetch article' });
  } finally {
    await db.destroy();
  }
});

app.listen(port, () => {
  console.log(`API server running at http://localhost:${port}`);
});