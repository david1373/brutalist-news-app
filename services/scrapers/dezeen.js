import puppeteer from 'puppeteer';
import slugify from 'slugify';
import knex from 'knex';
import config from '../../database/knexfile.js';

const db = knex(config);

export async function scrapeDezeenArticles(limit = 10) {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 800 });
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36');

    // Navigate to Dezeen
    await page.goto('https://www.dezeen.com/architecture', {
      waitUntil: 'networkidle0'
    });

    // Get article links
    const articles = await page.evaluate((limit) => {
      const articleNodes = document.querySelectorAll('article.article');
      const articles = [];
      
      for (let i = 0; i < Math.min(articleNodes.length, limit); i++) {
        const article = articleNodes[i];
        const link = article.querySelector('a.article-featured__link');
        const image = article.querySelector('img');
        
        articles.push({
          url: link?.href,
          title: link?.getAttribute('title'),
          featuredImage: image?.src
        });
      }
      
      return articles;
    }, limit);

    // Process each article
    for (const article of articles) {
      if (!article.url) continue;

      // Check if article already exists
      const exists = await db('articles')
        .where('source_url', article.url)
        .first();

      if (exists) continue;

      // Visit article page
      await page.goto(article.url, { waitUntil: 'networkidle0' });

      const content = await page.evaluate(() => {
        const article = document.querySelector('.article__content');
        const author = document.querySelector('.article__author-name');
        const date = document.querySelector('time');
        const images = Array.from(document.querySelectorAll('.article__content img'))
          .map(img => ({
            url: img.src,
            caption: img.alt,
            credit: img.getAttribute('data-credit')
          }));

        return {
          content: article?.innerText,
          author: author?.innerText,
          publishedDate: date?.getAttribute('datetime'),
          images
        };
      });

      // Store in database
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

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
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
