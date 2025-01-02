import puppeteer from 'puppeteer';

async function scrapeArticle(url) {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    console.log('Starting scrape of:', url);
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
    
    const content = await page.evaluate(() => {
      const selectors = [
        '.dezeen-content article',
        '.article-body',
        '.article__content',
        '.article__copy',
        'article'
      ];

      let mainContent;
      for (const selector of selectors) {
        mainContent = document.querySelector(selector);
        if (mainContent) break;
      }

      if (!mainContent) return null;

      const paragraphs = mainContent.querySelectorAll('p, h2, h3, blockquote');
      return Array.from(paragraphs)
        .map(el => el.outerHTML)
        .join('\n');
    });

    if (!content) {
      console.error('No content found using selectors');
      return { content: 'Content not available', images: [] };
    }

    console.log('Content length:', content.length);
    return { content, images: [] };

  } catch (error) {
    console.error('Scraping error:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

export { scrapeArticle };