import puppeteer from 'puppeteer';

async function scrapeArticle(url) {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  
  try {
    console.log('Scraping URL:', url);
    await page.goto(url, { waitUntil: 'networkidle0' });
    
    // Get article content
    const content = await page.evaluate(() => {
      const paragraphs = Array.from(document.querySelectorAll('.article__copy p'));
      return paragraphs.map(p => p.innerText).join('\n\n');
    });

    console.log('Content scraped:', content ? 'Yes' : 'No');
    return content;

  } catch (error) {
    console.error('Scraping error:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

export { scrapeArticle };