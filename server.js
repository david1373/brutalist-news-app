import 'dotenv/config';
import express from 'express';
import knex from 'knex';
import config from './database/knexfile.js';
import { scrapeArticle, updateArticle } from './services/scrapers/dezeen.js';

const app = express();
const port = process.env.PORT || 3001;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/api/articles/:id', async (req, res) => {
  const db = knex(config);
  
  try {
    console.log('Fetching article with ID:', req.params.id);
    const article = await db('articles')
      .where({ id: req.params.id })
      .first();
    
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    if (!article.original_content && article.source_url) {
      console.log('Scraping content for article:', article.id);
      try {
        const scrapedContent = await scrapeArticle(article.source_url);
        await updateArticle(article.id, scrapedContent);
        article.original_content = scrapedContent.original_content;
      } catch (error) {
        console.error('Error scraping article:', error);
      }
    }

    console.log('Sending article data:', article.id);
    res.json(article);
  } catch (error) {
    console.error('Database error:', error);
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