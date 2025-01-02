import 'dotenv/config';
import express from 'express';
import knex from 'knex';
import config from './database/knexfile.js';
import { rewriteArticle } from './src/services/gpt.js';

const app = express();
const port = process.env.PORT || 3001;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.VITE_API_URL || 'http://localhost:5173');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/api/articles/:id', async (req, res) => {
  const db = knex(config);
  
  try {
    const article = await db('articles')
      .where({ id: req.params.id })
      .first();
    
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    // Rewrite content if not already processed
    if (!article.processed_content) {
      article.processed_content = await rewriteArticle(article.content);
      
      // Store processed content
      await db('articles')
        .where({ id: article.id })
        .update({ 
          processed_content: article.processed_content,
          processed_at: new Date()
        });
    }
    
    res.json(article);
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({ error: 'Failed to fetch article' });
  } finally {
    await db.destroy();
  }
});

app.get('/api/articles', async (req, res) => {
  const db = knex(config);
  try {
    const articles = await db('articles')
      .select('*')
      .orderBy('created_at', 'desc');
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