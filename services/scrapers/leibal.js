import puppeteer from 'puppeteer';

export async function scrapeLeibalArticle(url) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox']
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto(url, { waitUntil: 'networkidle0' });
    
    const article = await page.evaluate(() => {
      const seenUrls = new Set();
      const images = Array.from(document.querySelectorAll('img'))
        .filter(img => {
          if (img.src.includes('sponsors') || 
              img.src.includes('logo') || 
              img.src.includes('hover') ||
              img.width < 800 || 
              img.height < 400) {
            return false;
          }
          if (seenUrls.has(img.src)) return false;
          seenUrls.add(img.src);
          return true;
        })
        .map(img => ({
          url: img.src,
          caption: img.alt || '',
          dimensions: { width: img.width, height: img.height }
        }));

      return {
        title: document.querySelector('.post-title')?.textContent?.trim(),
        content: document.querySelector('.post-content')?.textContent?.trim(),
        images,
        source: 'Leibal',
        url,
        date: document.querySelector('.post-date')?.textContent?.trim() || new Date().toISOString()
      };
    });
    
    return article;
  } finally {
    await browser.close();
  }
}