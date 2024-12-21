import puppeteer from 'puppeteer';
import knex from 'knex';
import config from '../../database/knexfile.js';

const db = knex(config);

export async function scrapeDezeenArticles(limit = 10) {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    timeout: 30000
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 800 });
    
    console.log('Navigating to Dezeen...');
    await page.goto('https://www.dezeen.com/architecture', {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });

    // Wait for articles to load
    await page.waitForSelector('article.article', { timeout: 10000 });
    
    console.log('Page loaded, looking for articles...');
    
    // Debug: Log the page content
    const pageTitle = await page.title();
    console.log('Page title:', pageTitle);
    
    const articles = await page.evaluate((limit) => {
      console.log('Starting article extraction...');
      const articleNodes = document.querySelectorAll('article.article');
      console.log('Found article nodes:', articleNodes.length);
      
      const articles = [];
      
      for (let i = 0; i < Math.min(articleNodes.length, limit); i++) {
        const article = articleNodes[i];
        const link = article.querySelector('a.article-featured__link, a.article__link');
        const image = article.querySelector('img');
        
        if (link) {
          articles.push({
            url: link.href,
            title: link.getAttribute('title') || link.textContent.trim(),
            featuredImage: image ? image.src : null
          });
        }
      }
      
      return articles;
    }, limit);

    console.log(`Found ${articles.length} articles:`);
    console.log(JSON.stringify(articles, null, 2));

    for (const article of articles) {
      if (!article.url) {
        console.log('Skipping article with no URL');
        continue;
      }

      // Check if article already exists
      const exists = await db('articles')
        .where('source_url', article.url)
        .first();

      if (exists) {
        console.log(`Article already exists: ${article.title}`);
        continue;
      }

      console.log(`Processing article: ${article.title}`);
      await page.goto(article.url, { 
        waitUntil: 'domcontentloaded',
        timeout: 30000
      });

      const content = await page.evaluate(() => {
        const article = document.querySelector('.article__content, .article-body');
        const author = document.querySelector('.article__author-name, .author-name');
        const date = document.querySelector('time');
        const images = Array.from(document.querySelectorAll('.article__content img, .article-body img'))
          .map(img => ({
            url: img.src,
            caption: img.alt,
            credit: img.getAttribute('data-credit')
          }));

        return {
          content: article ? article.innerText : null,
          author: author ? author.innerText : null,
          publishedDate: date ? date.getAttribute('datetime') : null,
          images
        };
      });

      if (!content.content) {
        console.log('No content found for article:', article.title);
        continue;
      }

      await db('articles').insert({
        title: article.title,
        original_content: content.content,
        source_url: article.url,
        source_name: 'Dezeen',
        featured_image: article.featuredImage,
        images: JSON.stringify(content.images),
        author: content.author,
        published_date: content.publishedDate,
        processing_status: 'pending'
      });

      console.log(`Saved article: ${article.title}`);
      // Add a delay between requests
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    return { success: true, count: articles.length };
  } catch (error) {
    console.error('Error scraping Dezeen:', error);
    return { success: false, error: error.message };
  } finally {
    await browser.close();
    await db.destroy();
  }
}
