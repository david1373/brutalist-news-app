import puppeteer from 'puppeteer';
import knex from 'knex';
import config from '../../database/knexfile.js';

async function scrapeArticle(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  try {
    await page.goto(url, { waitUntil: 'networkidle0' });
    
    // Get article content
    const content = await page.evaluate(() => {
      const articleBody = document.querySelector('.article__body');
      return articleBody ? articleBody.innerHTML : null;
    });

    // Get metadata
    const title = await page.$eval('h1', el => el.textContent);
    const author = await page.$eval('.article__author-name', el => el.textContent.trim()).catch(() => null);
    const featuredImage = await page.$eval('.article__hero-image img', el => el.src).catch(() => null);

    await browser.close();
    
    return {
      title,
      original_content: content,
      author,
      featured_image: featuredImage,
      source_name: 'Dezeen',
      source_url: url
    };
  } catch (error) {
    console.error('Error scraping article:', error);
    await browser.close();
    throw error;
  }
}

async function updateArticle(id, content) {
  const db = knex(config);
  try {
    await db('articles')
      .where({ id })
      .update({
        original_content: content.original_content,
        author: content.author,
        featured_image: content.featured_image,
        updated_at: new Date()
      });
  } finally {
    await db.destroy();
  }
}

export { scrapeArticle, updateArticle };