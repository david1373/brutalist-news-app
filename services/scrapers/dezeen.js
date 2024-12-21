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
    
    // Enable request interception
    await page.setRequestInterception(true);
    page.on('request', (request) => {
      // Block image, font, and stylesheet requests to speed up loading
      if (request.resourceType() === 'image' || 
          request.resourceType() === 'font' || 
          request.resourceType() === 'stylesheet') {
        request.abort();
      } else {
        request.continue();
      }
    });

    // Log console messages from the page
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    
    console.log('Navigating to Dezeen...');
    const response = await page.goto('https://www.dezeen.com/architecture/', {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    console.log('Response status:', response.status());
    console.log('Response headers:', response.headers());

    // Handle cookie consent if present
    try {
      await page.waitForSelector('#CybotCookiebotDialog', { timeout: 5000 });
      console.log('Cookie dialog found, accepting...');
      await page.click('#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll');
      await page.waitForTimeout(2000);
    } catch (e) {
      console.log('No cookie dialog found or already accepted');
    }

    // Take a screenshot before any manipulation
    await page.screenshot({ path: 'before-scroll.png' });

    // Scroll down to trigger lazy loading
    console.log('Scrolling page...');
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await page.waitForTimeout(2000);

    // Take another screenshot after scrolling
    await page.screenshot({ path: 'after-scroll.png' });

    // Debug: Log the entire page content
    const content = await page.content();
    console.log('Page content preview:', content.substring(0, 1000));

    // Try to find any links that look like articles
    const articles = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a[href*="dezeen.com"]'));
      return links
        .filter(link => {
          const href = link.href.toLowerCase();
          // Filter out navigation, category, and other non-article links
          return !href.includes('/tag/') && 
                 !href.includes('/category/') && 
                 !href.includes('/author/') && 
                 !href.includes('#comments');
        })
        .map(link => {
          const article = link.closest('article') || link.parentElement;
          const img = article ? article.querySelector('img') : null;
          
          return {
            url: link.href,
            title: link.textContent.trim(),
            featuredImage: img ? img.src : null
          };
        })
        .slice(0, 10); // Limit to 10 articles
    });

    console.log('Found articles:', JSON.stringify(articles, null, 2));

    return { success: true, count: articles.length, articles };
  } catch (error) {
    console.error('Error scraping Dezeen:', error);
    return { success: false, error: error.message };
  } finally {
    await browser.close();
    await db.destroy();
  }
}
