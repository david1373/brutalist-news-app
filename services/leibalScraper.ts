import puppeteer from 'puppeteer';

export async function scrapeLeibal(url: string) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto(url, { waitUntil: 'networkidle0' });

  const article = await page.evaluate(() => {
    const content = document.querySelector('.entry-content')?.textContent || '';
    const images = Array.from(document.querySelectorAll('.entry-content img'))
      .filter(img => {
        const rect = img.getBoundingClientRect();
        return rect.width >= 400 && rect.height >= 300;
      })
      .map(img => ({
        url: img.src,
        caption: img.alt || '',
        credit: img.getAttribute('data-credit') || 
               document.querySelector('.photo-credit')?.textContent || '',
        width: img.width,
        height: img.height
      }));

    const title = document.querySelector('.entry-title')?.textContent || '';
    const date = document.querySelector('.entry-date')?.textContent || '';

    return { content, images, title, date };
  });

  await browser.close();
  return article;
}