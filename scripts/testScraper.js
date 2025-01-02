import { getLeibalFeed, scrapeLeibalArticle } from '../services/scrapers/leibal';

async function test() {
  console.log('Testing Leibal scraper...');
  const urls = await getLeibalFeed();
  console.log('Found URLs:', urls);

  if (urls.length > 0) {
    const article = await scrapeLeibalArticle(urls[0]);
    console.log('Scraped article:', article);
  }
}

test().catch(console.error);