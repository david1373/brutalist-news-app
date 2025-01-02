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
      // Wait for images to load
      const title = document.querySelector('.post-title')?.textContent?.trim();
      const content = Array.from(document.querySelectorAll('.post-content p'))
        .map(p => p.textContent?.trim())
        .filter(Boolean)
        .join('\n\n');
      
      const images = Array.from(document.querySelectorAll('.post-content img, .feature-image img'))
        .filter(img => {
          const rect = img.getBoundingClientRect();
          return rect.width > 400 && rect.height > 300;
        })
        .map(img => ({
          url: img.src,
          caption: img.alt || '',
          dimensions: { width: img.width, height: img.height }
        }));

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