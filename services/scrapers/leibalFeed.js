import puppeteer from 'puppeteer';

export async function getLeibalArticles() {
  const browser = await puppeteer.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.goto('https://leibal.com/architecture/', { waitUntil: 'networkidle0' });
    
    // Get all article URLs from first 3 pages
    const articles = [];
    for (let i = 0; i < 3; i++) {
      const urls = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('article a'))
          .map(a => a.href)
          .filter(url => url.includes('/architecture/'));
      });
      
      articles.push(...urls);
      
      // Click next page if available
      const nextButton = await page.$('.next');
      if (nextButton) {
        await nextButton.click();
        await page.waitForSelector('article');
      } else {
        break;
      }
    }
    
    return [...new Set(articles)]; // Remove duplicates
  } finally {
    await browser.close();
  }
}