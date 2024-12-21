import puppeteer from 'puppeteer';
import knex from 'knex';
import config from '../../database/knexfile.js';

const db = knex(config);

export async function scrapeDezeenArticles(limit = 10) {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--window-size=1920,1080',
      '--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    ],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Set a more realistic user agent
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    console.log('Navigating to Dezeen...');
    const response = await page.goto('https://www.dezeen.com/architecture/', {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    console.log('Response status:', response.status());
    console.log('Page loaded, analyzing content...');

    // Debug: Take a screenshot
    await page.screenshot({ path: 'debug-screenshot.png' });
    
    // Wait for any article-like content
    await page.waitForSelector('.article, .post, .article-block', { timeout: 20000 });
    
    // Debug: Log the page title
    const pageTitle = await page.title();
    console.log('Page title:', pageTitle);

    // Debug: Log HTML structure
    const bodyHTML = await page.evaluate(() => document.body.innerHTML);
    console.log('First 500 chars of HTML:', bodyHTML.substring(0, 500));
    
    const articles = await page.evaluate((limit) => {
      // Try multiple possible selectors
      const selectors = [
        'article',
        '.article',
        '.post',
        '.article-block',
        '[data-post-type="article"]'
      ];

      let articleNodes = [];
      for (const selector of selectors) {
        const nodes = document.querySelectorAll(selector);
        if (nodes.length > 0) {
          console.log(`Found ${nodes.length} articles with selector: ${selector}`);
          articleNodes = nodes;
          break;
        }
      }

      return Array.from(articleNodes)
        .slice(0, limit)
        .map(article => {
          // Try multiple selectors for links and titles
          const link = article.querySelector('a[href*="dezeen.com"]') || 
                      article.querySelector('a:not([href*="#"])');
          const image = article.querySelector('img');
          const title = article.querySelector('h2, h3, .title');

          if (!link) return null;

          return {
            url: link.href,
            title: title ? title.textContent.trim() : link.textContent.trim(),
            featuredImage: image ? image.src : null
          };
        })
        .filter(Boolean);
    }, limit);

    console.log('Found articles:', articles);

    // Process articles...
    // Rest of the code remains the same...

    return { success: true, count: articles.length };
  } catch (error) {
    console.error('Error scraping Dezeen:', error);
    // If there's a screenshot, log its location
    console.log('Debug screenshot saved as debug-screenshot.png');
    return { success: false, error: error.message };
  } finally {
    await browser.close();
    await db.destroy();
  }
}
