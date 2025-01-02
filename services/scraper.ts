import puppeteer from 'puppeteer';

export async function scrapeArticle(url: string) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  const images = await page.evaluate(() => {
    const articleImages = Array.from(document.querySelectorAll('img'));
    return articleImages
      .filter(img => {
        // Filter out small images, ads, and icons
        const rect = img.getBoundingClientRect();
        const minSize = 400; // Minimum size in pixels
        return rect.width >= minSize && rect.height >= minSize &&
               !img.src.includes('logo') &&
               !img.src.includes('ad') &&
               !img.src.includes('icon');
      })
      .map(img => ({
        url: img.src,
        caption: img.alt || '',
        credit: img.getAttribute('data-credit') || '',
        width: img.width,
        height: img.height
      }));
  });

  const content = await page.evaluate(() => {
    const articleBody = document.querySelector('.article-body');
    return articleBody ? articleBody.textContent : '';
  });

  await browser.close();
  return { content, images };
}