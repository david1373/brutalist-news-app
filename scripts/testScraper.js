import puppeteer from 'puppeteer';

async function test() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox']
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Navigate and wait for content
    await page.goto('https://leibal.com/architecture/house-in-yoga/', {
      waitUntil: 'networkidle0'
    });
    await page.waitForSelector('img', {timeout: 5000});
    
    // Debug DOM structure
    const article = await page.evaluate(() => {
      console.log('Available images:', document.querySelectorAll('img').length);
      
      const images = Array.from(document.querySelectorAll('img'))
        .filter(img => {
          console.log('Image:', {
            src: img.src,
            width: img.width,
            height: img.height,
            className: img.className
          });
          return true;
        })
        .map(img => ({
          url: img.src,
          caption: img.alt || '',
          dimensions: { width: img.width, height: img.height }
        }));

      const content = document.querySelector('.post-content')?.textContent;
      const title = document.querySelector('.post-title')?.textContent;

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