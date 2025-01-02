import puppeteer from 'puppeteer';

async function scrapeArticle(url) {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    console.log('Scraping:', url);
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
    
    const content = await page.evaluate(() => {
      // List of possible content selectors
      const selectors = [
        '.article__content',
        '.dezeen-content',
        '.article__copy',
        '.article-body',
        'article',
        '.post-content'
      ];
      
      // Try each selector
      for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element) {
          console.log('Found content with selector:', selector);
          const paragraphs = element.querySelectorAll('p');
          const text = Array.from(paragraphs)
            .map(p => p.textContent.trim())
            .filter(text => text.length > 0)
            .join('\n\n');
          
          if (text.length > 0) return text;
        }
      }
      
      // If no selector works, try getting all paragraphs
      const allParagraphs = document.querySelectorAll('p');
      return Array.from(allParagraphs)
        .map(p => p.textContent.trim())
        .filter(text => text.length > 0)
        .join('\n\n');
    });

    console.log('Content length:', content?.length || 0);
    if (!content) throw new Error('No content found');
    
    return content;
  } catch (error) {
    console.error('Scraping error:', error.message);
    throw error;
  } finally {
    await browser.close();
  }
}

export { scrapeArticle };