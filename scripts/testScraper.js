import puppeteer from 'puppeteer';

async function test() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox']
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto('https://leibal.com/architecture/house-in-yoga/', {
      waitUntil: 'networkidle0'
    });
    
    const article = await page.evaluate(() => {
      // Filter and deduplicate images
      const seenUrls = new Set();
      const images = Array.from(document.querySelectorAll('img'))
        .filter(img => {
          // Filter out logos, sponsors, and small images
          if (img.src.includes('sponsors') || 
              img.src.includes('logo') || 
              img.src.includes('hover') ||
              img.width < 800 || 
              img.height < 400) {
            return false;
          }
          
          // Deduplicate
          if (seenUrls.has(img.src)) return false;
          seenUrls.add(img.src);
          
          return true;
        })
        .map(img => ({
          url: img.src,
          caption: img.alt || '',
          dimensions: { width: img.width, height: img.height }
        }));

      const content = document.querySelector('.post-content')?.textContent?.trim();
      const title = document.querySelector('.post-title')?.textContent?.trim();

      return { title, content, images };
    });
    
    console.log('Scraped article:', JSON.stringify(article, null, 2));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
}

test();