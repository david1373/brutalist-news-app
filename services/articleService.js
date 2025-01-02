import { scrapeLeibalArticle } from './scrapers/leibal';
import { scrapeDezeenArticle } from './scrapers/dezeen';
import { getLeibalArticles } from './scrapers/leibalFeed';

export async function getAllArticles() {
  try {
    // Get Leibal articles
    const leibalUrls = await getLeibalArticles();
    const leibalArticles = await Promise.all(
      leibalUrls.map(url => scrapeLeibalArticle(url)
        .catch(err => {
          console.error(`Failed to scrape ${url}:`, err);
          return null;
        })
      )
    );

    // Get Dezeen articles (assuming this is already implemented)
    const dezeenArticles = await getDezeenArticles();

    // Combine and sort by date
    const allArticles = [...leibalArticles, ...dezeenArticles]
      .filter(article => article !== null)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    return allArticles;
  } catch (error) {
    console.error('Error fetching articles:', error);
    throw error;
  }
}