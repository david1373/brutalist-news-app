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
      const articleContent = document.querySelector('.article__content, .dezeen-content');
      if (!articleContent) return null;
      
      const paragraphs = articleContent.querySelectorAll('p');
      return Array.from(paragraphs)
        .map(p => p.textContent.trim())
        .filter(text => text.length > 0)
        .join('\n\n');
    });

    console.log('Content found:', !!content);
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