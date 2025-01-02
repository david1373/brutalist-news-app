import 'dotenv/config';
import express from 'express';
import knex from 'knex';
import config from './database/knexfile.js';
import { scrapeArticle } from './services/scrapers/dezeen.js';
import OpenAI from 'openai';

const openai = new OpenAI();

const app = express();
const port = process.env.PORT || 3001;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

async function transformContent(content) {
  try {
    console.log('Transforming content with OpenAI...');
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are Jack Kerouac. Rewrite this architecture article in your distinctive stream-of-consciousness style while maintaining accuracy about architectural details, materials, and design concepts."
        },
        {
          role: "user",
          content
        }
      ],
      temperature: 0.7
    });

    console.log('Content transformed successfully');
    return response.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI error:', error);
    return null;
  }
}

app.get('/api/articles/:id', async (req, res) => {
  const db = knex(config);
  
  try {
    const article = await db('articles')
      .where({ id: req.params.id })
      .first();
    
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    if (article.original_content === 'Pending content fetch' && article.source_url) {
      try {
        console.log('Fetching content for:', article.source_url);
        const { content, images } = await scrapeArticle(article.source_url);
        const transformedContent = await transformContent(content);
        
        const updates = {
          original_content: content,
          images: JSON.stringify(images),
          updated_at: new Date()
        };

        if (transformedContent) {
          updates.transformed_content = transformedContent;
        }

        await db('articles')
          .where({ id: article.id })
          .update(updates);

        article.original_content = content;
        article.transformed_content = transformedContent;
        article.images = images;
      } catch (error) {
        console.error('Content processing error:', error);
      }
    }

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