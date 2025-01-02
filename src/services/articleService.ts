import { scrapeLeibalArticle } from './scrapers/leibal';
import { Article } from '@/types';

export async function getAllArticles(): Promise<Article[]> {
  const leibalUrls = [
    'https://leibal.com/architecture/house-in-yoga/',
    'https://leibal.com/architecture/the-pavilion/'
  ];

  const articles = await Promise.all(
    leibalUrls.map(url =>
      scrapeLeibalArticle(url).catch(error => {
        console.error(`Failed to scrape ${url}:`, error);
        return null;
      })
    )
  );

  return articles.filter((article): article is Article => article !== null);
}