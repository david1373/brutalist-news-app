import { scrapeDezeenArticles } from '../services/scrapers/dezeen.js';

async function runScraper() {
  try {
    console.log('Starting Dezeen scraper...');
    const result = await scrapeDezeenArticles(5);
    console.log('Scraping result:', result);
  } catch (error) {
    console.error('Scraping failed:', error);
    process.exit(1);
  }
}

runScraper();
