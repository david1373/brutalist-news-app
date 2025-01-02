import puppeteer from 'puppeteer';
import { Article } from '../../types';

export async function scrapeLeibalArticle(url: string): Promise<Article> {
  const browser = await puppeteer.launch();
  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });

    const article = await page.evaluate(() => {
      const title = document.querySelector('h1.entry-title')?.textContent?.trim() || '';
      const content = Array.from(document.querySelectorAll('.entry-content p'))
        .map(p => p.textContent?.trim())
        .filter(Boolean)
        .join('\n\n');
      
      const images = Array.from(document.querySelectorAll('.entry-content img'))
        .filter(img => {
          const rect = img.getBoundingClientRect();
          return rect.width >= 800 && rect.height >= 400;
        })
        .map(img => ({
          url: img.src,
          caption: img.alt || '',
          credit: img.getAttribute('data-credit') || document.querySelector('.photo-credit')?.textContent || ''
        }));

      const date = document.querySelector('.entry-date')?.textContent || new Date().toISOString();
      
      return { title, content, images, date };
    });

    return {
      ...article,
      source: 'Leibal',
      url,
      id: Buffer.from(url).toString('base64')
    };
  } finally {
    await browser.close();
  }
}

export async function getLeibalFeed(): Promise<string[]> {
  const browser = await puppeteer.launch();
  try {
    const page = await browser.newPage();
    await page.goto('https://leibal.com/architecture/', { waitUntil: 'networkidle0' });

    const articles = await page.evaluate(() => 
      Array.from(document.querySelectorAll('.article-link'))
        .map(link => link.href)
        .filter(href => href.includes('/architecture/'))
    );

    return articles;
  } finally {
    await browser.close();
  }
}