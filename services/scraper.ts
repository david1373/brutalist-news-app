import { scrapeLeibal } from './leibalScraper';
import { scrapeDezeen } from './dezeenScraper';

export async function scrapeArticle(url: string) {
  if (url.includes('leibal.com')) {
    return scrapeLeibal(url);
  } else if (url.includes('dezeen.com')) {
    return scrapeDezeen(url);
  }
  throw new Error('Unsupported website');
}

// Add Leibal to the source list
export const SOURCES = [
  {
    name: 'Dezeen',
    baseUrl: 'https://www.dezeen.com',
    feedUrl: 'https://www.dezeen.com/architecture/feed/'
  },
  {
    name: 'Leibal',
    baseUrl: 'https://leibal.com',
    feedUrl: 'https://leibal.com/feed/'
  }
];