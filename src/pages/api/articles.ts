import type { NextApiRequest, NextApiResponse } from 'next';
import { getAllArticles } from '@/services/articleService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const articles = await getAllArticles();
    res.status(200).json(articles);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Failed to fetch articles' });
  }
}