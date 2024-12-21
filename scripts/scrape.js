import { scrapeDezeenArticles } from '../services/scrapers/dezeen.js';
import knex from 'knex';
import config from '../database/knexfile.js';

console.log('Starting scraper...');

async function runScraper() {
  const db = knex(config);
  
  try {
    console.log('Testing database connection...');
    await db.raw('SELECT 1+1 as result');
    console.log('Database connection successful');

    const result = await scrapeDezeenArticles(5);
    
    if (result.success && result.articles) {
      console.log(`Successfully scraped ${result.articles.length} articles`);
      
      // Check existing articles
      const existingUrls = await db('articles')
        .whereIn('source_url', result.articles.map(a => a.url))
        .pluck('source_url');
      
      console.log(`Found ${existingUrls.length} existing articles`);
      
      // Filter out existing articles
      const newArticles = result.articles.filter(a => !existingUrls.includes(a.url));
      
      console.log(`Inserting ${newArticles.length} new articles`);
      
      if (newArticles.length > 0) {
        await db('articles').insert(
          newArticles.map(article => ({
            title: article.title,
            original_content: 'Pending content fetch',
            source_url: article.url,
            source_name: 'Dezeen',
            featured_image: article.featuredImage,
            processing_status: 'pending'
          }))
        );
        console.log('Articles inserted successfully');
      }
    }

    const totalArticles = await db('articles').count('* as count').first();
    console.log(`Total articles in database: ${totalArticles.count}`);

  } catch (error) {
    console.error('Scraping failed:', error);
    process.exit(1);
  } finally {
    await db.destroy();
  }
}

runScraper();
