import { scrapeLeibalArticle } from '../services/scrapers/leibal.js';

async function test() {
  try {
    const article = await scrapeLeibalArticle('https://leibal.com/architecture/house-in-yoga/');
    console.log('Scraped article:', article);
  } catch (error) {
    console.error('Error:', error);
  }
}

test();