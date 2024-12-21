import puppeteer from 'puppeteer';
import knex from 'knex';
import config from '../../database/knexfile.js';

const db = knex(config);

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export async function scrapeDezeenArticles(limit = 10) {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--window-size=1920,1080',
    ],
  });

  try {
    const page = await browser.newPage();
    
    // Only block ads and trackers
    await page.setRequestInterception(true);
    page.on('request', (request) => {
      if (request.url().includes('googletag') || 
          request.url().includes('analytics') || 
          request.url().includes('adserver')) {
        request.abort();
      } else {
        request.continue();
      }
    });

    // Log console messages from the page
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    
    console.log('Navigating to Dezeen...');
    await page.goto('https://www.dezeen.com/architecture/', {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    // Wait for the main content to load
    console.log('Waiting for content to load...');
    await delay(5000);

    console.log('Looking for articles...');
    const articles = await page.evaluate(() => {
      // Find all article containers
      const articleContainers = document.querySelectorAll('.article-block, article, .post');
      console.log('Found', articleContainers.length, 'potential articles');
      
      return Array.from(articleContainers)
        .map(container => {
          try {
            const link = container.querySelector('a[href*="dezeen.com"]');
            const heading = container.querySelector('h2, h3');
            const image = container.querySelector('img');
            
            if (!link) return null;
            
            return {
              url: link.href,
              title: heading ? heading.textContent.trim() : link.textContent.trim(),
              featuredImage: image ? image.src : null
            };
          } catch (e) {
            console.error('Error processing article:', e);
            return null;
          }
        })
        .filter(Boolean)
        .slice(0, 10);
    });

    console.log('Found articles:', JSON.stringify(articles, null, 2));
    
    if (articles.length === 0) {
      console.log('No articles found. Taking debug screenshot...');
      await page.screenshot({ path: 'no-articles-debug.png', fullPage: true });
    }

    return { success: true, count: articles.length, articles };
  } catch (error) {
    console.error('Error scraping Dezeen:', error);
    return { success: false, error: error.message };
  } finally {
    await browser.close();
    await db.destroy();
  }
}
