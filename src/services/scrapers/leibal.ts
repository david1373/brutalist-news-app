import puppeteer from 'puppeteer';
import { Article } from '@/types';

export async function scrapeLeibalArticle(url: string): Promise<Article> {
  const browser = await puppeteer.launch();
  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });
    
    const article = await page.evaluate(() => {
      const images = Array.from(document.querySelectorAll('img'))
        .filter(img => {
          const rect = img.getBoundingClientRect();
          return rect.width >= 800 && rect.height >= 400;
        })
        .map(img => ({
          url: img.src,
          caption: img.alt || ''
        }));

      return {
        title: document.querySelector('.post-title')?.textContent?.trim() || '',
        content: document.querySelector('.post-content')?.textContent?.trim() || '',
        images,
        date: document.querySelector('.post-date')?.textContent || new Date().toISOString()
      };
    });
    
    return {
      ...article,
      source: 'Leibal',
      url
    };
  } finally {
    await browser.close();
  }
}