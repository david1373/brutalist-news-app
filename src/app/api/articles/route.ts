import { NextResponse } from 'next/server';

export async function GET() {
  const mockArticles = [{
    id: '1',
    title: 'Brutalist Architecture',
    content: 'Example content about brutalist architecture...',
    images: [{
      url: 'https://picsum.photos/800/600',
      caption: 'Example brutalist building'
    }],
    source: 'Test Source',
    date: new Date().toISOString()
  }];

  return NextResponse.json(mockArticles);
}