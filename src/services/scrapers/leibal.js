import puppeteer from 'puppeteer';

export async function scrapeLeibalArticle(url) {
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
          credit: img.getAttribute('data-credit') || ''
        }));

      return { title, content, images };
    });

    return article;
  } finally {
    await browser.close();
  }
}