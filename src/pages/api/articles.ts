import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const mockArticles = [{
      title: 'Test Article',
      content: 'Test content',
      images: [{ url: 'https://leibal.com/test.jpg', caption: 'Test' }],
      source: 'Test',
      url: 'https://test.com',
      date: new Date().toISOString()
    }];
    
    res.status(200).json(mockArticles);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
}