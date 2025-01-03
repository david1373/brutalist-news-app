import puppeteer from 'puppeteer'

export async function getAllArticles() {
  const browser = await puppeteer.launch()
  try {
    const page = await browser.newPage()
    await page.goto('https://leibal.com/architecture/')
    
    const articles = await page.evaluate(() => {
      const posts = document.querySelectorAll('article')
      return Array.from(posts).map(post => ({
        id: post.id,
        title: post.querySelector('h2')?.textContent?.trim() || '',
        content: post.querySelector('p')?.textContent?.trim() || '',
        images: Array.from(post.querySelectorAll('img')).map(img => ({
          url: img.src,
          caption: img.alt
        })),
        url: post.querySelector('a')?.href || ''
      }))
    })

    return articles
  } finally {
    await browser.close()
  }
}

export async function getArticleById(id: string) {
  const articles = await getAllArticles()
  return articles.find(article => article.id === id)
}