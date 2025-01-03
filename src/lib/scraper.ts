import puppeteer from 'puppeteer';

export async function scrapeArticles() {
  const browser = await puppeteer.launch({ headless: 'new' });
  try {
    const page = await browser.newPage();
    await page.goto('https://leibal.com/architecture');
    
    const articles = await page.evaluate(() => {
      const posts = document.querySelectorAll('article');
      return Array.from(posts).map((post, index) => ({
        id: String(index + 1),
        title: post.querySelector('h2')?.textContent?.trim() || 'Untitled',
        content: post.querySelector('p')?.textContent?.trim() || '',
        images: Array.from(post.querySelectorAll('img')).map(img => ({
          url: img.src,
          caption: img.alt || ''
        })).filter(img => !img.url.includes('placeholder')),
        source: 'Leibal',
        date: new Date().toISOString()
      }));
    });

    return articles;
  } finally {
    await browser.close();
  }
}