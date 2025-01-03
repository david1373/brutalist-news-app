import { NextResponse } from 'next/server';
import { scrapeArticles } from '@/services/scraper';

export async function GET() {
  try {
    const articles = await scrapeArticles();
    return NextResponse.json(articles);
  } catch (error) {
    console.error('Failed to fetch articles:', error);
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
  }
}