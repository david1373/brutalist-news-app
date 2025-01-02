import type { NextApiRequest, NextApiResponse } from 'next';
import { getAllArticles } from '../../services/articleService';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const articles = await getAllArticles();
    res.status(200).json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
}