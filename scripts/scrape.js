import { scrapeDezeenArticles } from '../services/scrapers/dezeen.js';

console.log('Starting scraper...');

async function runScraper() {
  try {
    const result = await scrapeDezeenArticles(5);
    console.log('Scraping completed:', result);
  } catch (error) {
    console.error('Scraping failed:', error);
    process.exit(1);
  }
}

runScraper();
