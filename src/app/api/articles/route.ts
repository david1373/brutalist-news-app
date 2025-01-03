import { NextResponse } from 'next/server'

export async function GET() {
  const mockArticles = [{
    id: '1',
    title: 'Test Article',
    content: 'Test content',
    images: [{ url: 'https://leibal.com/test.jpg', caption: 'Test caption' }],
    url: 'https://test.com',
    source: 'Test Source',
    date: new Date().toISOString()
  }]

  return NextResponse.json(mockArticles)
}