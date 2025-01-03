import { NextResponse } from 'next/server';
import { scrapeArticles } from '@/lib/scraper';

export async function GET() {
  try {
    // Temporarily return mock data while developing
    const mockArticles = [
      {
        id: '1',
        title: 'Sample Architecture Article',
        content: 'This is a sample article about brutalist architecture.',
        images: [{
          url: 'https://picsum.photos/800/600',
          caption: 'Sample Image'
        }],
        source: 'Test',
        date: new Date().toISOString()
      }
    ];
    
    return NextResponse.json(mockArticles);
  } catch (error) {
    console.error('Failed to fetch articles:', error);
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
  }
}