import puppeteer from 'puppeteer';

async function scrapeArticle(url) {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36');
    
    console.log('Scraping:', url);
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
    
    const { content, images } = await page.evaluate(() => {
      // Get article images
      const imgElements = document.querySelectorAll('figure img');
      const images = Array.from(imgElements).map(img => ({
        src: img.src,
        alt: img.alt || '',
        caption: img.closest('figcaption')?.textContent || ''
      }));

      // Get article content
      const article = document.querySelector('.article__content, article');
      if (!article) return { content: null, images };

      const contentElements = Array.from(article.querySelectorAll('p, h2, h3, blockquote'));
      const content = contentElements
        .map(el => el.textContent.trim())
        .filter(text => text.length > 0)
        .join('\n\n');

      return { content, images };
    });

    if (!content) throw new Error('No content found');
    console.log(`Found ${images.length} images and ${content.length} chars of content`);
    
    return { content, images };
  } catch (error) {
    console.error('Scraping error:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

export { scrapeArticle };