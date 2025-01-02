import puppeteer from 'puppeteer';

async function test() {
  const browser = await puppeteer.launch();
  try {
    const page = await browser.newPage();
    await page.goto('https://leibal.com/architecture/house-in-yoga/');
    
    const article = await page.evaluate(() => {
      const title = document.querySelector('h1.entry-title')?.textContent;
      const content = document.querySelector('.entry-content')?.textContent;
      const images = Array.from(document.querySelectorAll('.entry-content img'))
        .map(img => ({
          url: img.src,
          caption: img.alt || ''
        }));
      return { title, content, images };
    });
    
    console.log('Scraped article:', article);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
}

test();