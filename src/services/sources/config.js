export const contentSources = {
  archdaily: {
    name: 'ArchDaily',
    baseUrl: 'https://www.archdaily.com',
    category: ['sustainability', 'brutalism'],
    selectors: {
      title: '.article-title',
      content: '.article-content',
      images: '.article-image',
      author: '.author-name',
      date: '.publication-date'
    },
    rateLimit: 1000,
    language: 'en'
  },
  
  nordicArchitecture: {
    name: 'Nordic Architecture',
    baseUrl: 'https://nordicarchitecture.com',
    category: ['sustainability', 'scandinavian'],
    selectors: {
      title: '.post-title',
      content: '.post-content',
      images: '.post-image',
      author: '.post-author',
      date: '.post-date'
    },
    rateLimit: 1500,
    language: 'en'
  }
  // Additional sources...
};