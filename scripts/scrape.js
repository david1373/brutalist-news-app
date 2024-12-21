import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { scrapeDezeenArticles } from '../services/scrapers/dezeen.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
