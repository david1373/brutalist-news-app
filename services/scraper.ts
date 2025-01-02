import { scrapeLeibalArticle, getLeibalFeed } from './scrapers/leibal';
import { scrapeDezeenArticle } from './scrapers/dezeen';
import { Article } from '../types';

export async function scrapeArticle(url: string): Promise<Article> {
  if (url.includes('leibal.com')) {
    return scrapeLeibalArticle(url);
  } else if (url.includes('dezeen.com')) {
    return scrapeDezeenArticle(url);
  }
  throw new Error('Unsupported website');
}

export async function getFreshArticles(): Promise<Article[]> {
  const leibalUrls = await getLeibalFeed();
  const articles = await Promise.all(
    leibalUrls.map(url => scrapeArticle(url).catch(err => {
      console.error(`Failed to scrape ${url}:`, err);
      return null;
    }))
  );
  
  return articles.filter((article): article is Article => article !== null);
}