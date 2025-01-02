import puppeteer from 'puppeteer';

async function scrapeArticle(url) {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
    
    const { content, images } = await page.evaluate(() => {
      const article = document.querySelector('article');
      if (!article) return { content: null, images: [] };
      
      // Get all images
      const imageElements = article.querySelectorAll('img');
      const images = Array.from(imageElements)
        .map(img => ({
          src: img.src,
          alt: img.alt || '',
          caption: img.closest('figure')?.querySelector('figcaption')?.textContent || ''
        }))
        .filter(img => img.src && !img.src.includes('avatar') && !img.src.includes('icon'));

      // Get content with proper formatting
      const contentElements = Array.from(article.children);
      const content = contentElements
        .map(el => {
          if (el.tagName === 'P') return `<p>${el.innerHTML}</p>`;
          if (el.tagName === 'H2') return `<h2>${el.innerHTML}</h2>`;
          if (el.tagName === 'H3') return `<h3>${el.innerHTML}</h3>`;
          if (el.tagName === 'BLOCKQUOTE') return `<blockquote>${el.innerHTML}</blockquote>`;
          return '';
        })
        .filter(text => text.length > 0)
        .join('\n\n');

      return { content, images };
    });

    if (!content) throw new Error('No content found');
    
    return { content, images };
  } catch (error) {
    console.error('Scraping error:', error.message);
    throw error;
  } finally {
    await browser.close();
  }
}

export { scrapeArticle };