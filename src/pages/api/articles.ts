import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('API route hit');
  const mockArticles = [{
    title: 'Test Article',
    content: 'Test content',
    images: [{ url: 'https://leibal.com/test.jpg', caption: 'Test' }],
    source: 'Test',
    url: 'https://test.com',
    date: new Date().toISOString()
  }];
  
  return res.status(200).json({ articles: mockArticles });
}