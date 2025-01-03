import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const article = {
      id: params.id,
      title: 'Sample Article',
      content: 'This is a sample article content.',
      images: [{ url: 'https://picsum.photos/800/600', caption: 'Sample image' }],
      source: 'Sample Source',
      date: new Date().toISOString()
    };
    
    return NextResponse.json(article);
  } catch (error) {
    return NextResponse.json({ error: 'Article not found' }, { status: 404 });
  }
}