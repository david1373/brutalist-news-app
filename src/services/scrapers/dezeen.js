const puppeteer = await import('puppeteer');

export async function scrapeArticle(url) {
  const browser = await puppeteer.default.launch();
  try {
    const page = await browser.newPage();
    await page.goto(url);
    
    const article = await page.evaluate(() => ({
      title: document.querySelector('h1')?.textContent,
      content: document.querySelector('article')?.textContent,
      images: Array.from(document.querySelectorAll('img[src*="dezeen"]'))
        .map(img => ({
          url: img.src,
          caption: img.alt
        }))
    }));
    
    return { ...article, source: 'Dezeen', url };
  } finally {
    await browser.close();
  }
}