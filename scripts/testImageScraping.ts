import { scrapeArticle } from '../services/scraper';

async function testScraping() {
  const testUrl = 'https://www.dezeen.com/2024/01/02/minimalist-house-japan-architecture/';
  
  try {
    const result = await scrapeArticle(testUrl);
    console.log('Images found:', result.images.length);
    console.log('Image details:', result.images);
  } catch (error) {
    console.error('Scraping failed:', error);
  }
}

testScraping();